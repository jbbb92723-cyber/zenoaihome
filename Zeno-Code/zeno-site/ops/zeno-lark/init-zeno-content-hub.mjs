import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const schemaPath = process.argv[2] || path.join(cwd, "schema.json");
const manifestPath = process.argv[3] || path.join(cwd, "manifest.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

function extractJson(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error(`Cannot parse lark-cli output: ${trimmed}`);
  }
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function runLark(args) {
  let lastError = null;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const result = spawnSync("lark-cli", args, {
      cwd,
      encoding: "utf8",
      shell: process.platform === "win32",
    });
    const combined = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    if (result.status === 0) {
      return extractJson(combined);
    }
    lastError = new Error(`lark-cli ${args.join(" ")} failed:\n${combined}`);
    if (!combined.includes("retryable") && !combined.includes("locked")) {
      throw lastError;
    }
    sleep(1500 * attempt);
  }
  throw lastError;
}

function listTables(baseToken) {
  return runLark(["base", "+table-list", "--base-token", baseToken, "--as", "bot"]).data.tables || [];
}

function listFields(baseToken, tableId) {
  return runLark([
    "base",
    "+field-list",
    "--base-token",
    baseToken,
    "--table-id",
    tableId,
    "--as","bot",
  ]).data.fields || [];
}

function createField(baseToken, tableId, field, index) {
  const fileName = `field-node-${index}.json`;
  fs.writeFileSync(path.join(cwd, fileName), JSON.stringify(field), "utf8");
  return runLark([
    "base",
    "+field-create",
    "--base-token",
    baseToken,
    "--table-id",
    tableId,
    "--json",
    `@${fileName}`,
    "--as","bot",
  ]);
}

function createTextFieldFallback(baseToken, tableId, field, index) {
  const fallback = { name: field.name, type: "text" };
  const fileName = `field-node-fallback-${index}.json`;
  fs.writeFileSync(path.join(cwd, fileName), JSON.stringify(fallback), "utf8");
  return runLark([
    "base",
    "+field-create",
    "--base-token",
    baseToken,
    "--table-id",
    tableId,
    "--json",
    `@${fileName}`,
    "--as","bot",
  ]);
}

function getTableId(createResponse) {
  const table = createResponse?.data?.table;
  return table?.id || table?.table_id || table?.tableId || null;
}

const baseToken = schema.baseToken;
const manifest = {
  baseToken,
  baseUrl: schema.baseUrl,
  updatedAt: new Date().toISOString(),
  tables: [],
};

let tables = listTables(baseToken);

for (let i = 0; i < schema.tables.length; i += 1) {
  const tableSpec = schema.tables[i];
  let table = tables.find((item) => item.name === tableSpec.name);
  let tableStatus = "existing";

  if (!table && tableSpec.useDefaultTable) {
    runLark([
      "base",
      "+table-update",
      "--base-token",
      baseToken,
      "--table-id",
      schema.defaultTableId,
      "--name",
      tableSpec.name,
      "--as","bot",
    ]);
    table = { id: schema.defaultTableId, name: tableSpec.name };
    tableStatus = "renamed-default";
  }

  if (!table) {
    sleep(800);
    const created = runLark([
      "base",
      "+table-create",
      "--base-token",
      baseToken,
      "--name",
      tableSpec.name,
      "--as","bot",
    ]);
    table = { id: getTableId(created), name: tableSpec.name };
    if (!table.id) {
      tables = listTables(baseToken);
      table = tables.find((item) => item.name === tableSpec.name);
    }
    tableStatus = "created";
  }

  if (!table?.id) {
    throw new Error(`Could not resolve table id for ${tableSpec.name}`);
  }

  const existingFields = listFields(baseToken, table.id);
  const existingFieldNames = new Set(existingFields.map((field) => field.name));
  const fieldResults = [];

  for (let j = 0; j < tableSpec.fields.length; j += 1) {
    const field = tableSpec.fields[j];
    if (existingFieldNames.has(field.name)) {
      fieldResults.push({ name: field.name, type: field.type, status: "existing" });
      continue;
    }

    try {
      sleep(500);
      createField(baseToken, table.id, field, i * 100 + j);
      fieldResults.push({ name: field.name, type: field.type, status: "created" });
    } catch (error) {
      sleep(1000);
      createTextFieldFallback(baseToken, table.id, field, i * 100 + j);
      fieldResults.push({
        name: field.name,
        type: field.type,
        status: "created-as-text",
        originalError: error.message,
      });
    }
  }

  manifest.tables.push({
    name: tableSpec.name,
    id: table.id,
    status: tableStatus,
    fields: fieldResults,
  });

  tables = listTables(baseToken);
}

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(JSON.stringify(manifest, null, 2));
