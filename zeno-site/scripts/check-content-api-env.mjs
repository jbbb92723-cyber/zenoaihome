import fs from "node:fs";
import { spawnSync } from "node:child_process";

const envFile = ".env.local";
const resultFile = "content-api-env-check-result.json";

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};

  const env = {};
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#][^=]+?)\s*=\s*(.*)\s*$/);
    if (!match) continue;

    const key = match[1].trim();
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function redact(text) {
  return String(text || "")
    .replace(/postgres(?:ql)?:\/\/([^:@\s]+):([^@\s]+)@/gi, "postgresql://$1:***@")
    .replace(/Bearer\s+[\w.-]+/gi, "Bearer ***")
    .replace(/(ZENO_INTERNAL_API_TOKEN=)[^\s]+/gi, "$1***")
    .trim();
}

function describeUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return {
      protocol: url.protocol.replace(/:$/, ""),
      host: url.hostname,
      port: url.port || null,
      database: url.pathname.replace(/^\//, "") || null,
      username: url.username ? `${url.username.slice(0, 8)}***` : null,
      passwordConfigured: Boolean(url.password),
      queryKeys: [...url.searchParams.keys()],
    };
  } catch (error) {
    return {
      parseError: error.message,
      startsWithPostgres: /^postgres/i.test(value),
      length: value.length,
    };
  }
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    ...options,
  });

  return {
    ok: result.status === 0,
    status: result.status,
    stdout: redact(result.stdout),
    stderr: redact(result.stderr || result.error?.message || ""),
  };
}

function prismaExecute(url, label, env) {
  if (!url) {
    return {
      label,
      ok: false,
      skipped: true,
      reason: "missing_url",
    };
  }

  const result = run(
    process.execPath,
    ["node_modules/prisma/build/index.js", "db", "execute", "--stdin", "--url", url],
    {
      env: {
        ...process.env,
        ...env,
        PRISMA_HIDE_UPDATE_MESSAGE: "true",
      },
      input: "SELECT 1;\n",
    },
  );

  return {
    label,
    ok: result.ok,
    status: result.status,
    output: [result.stdout, result.stderr].filter(Boolean).join("\n").trim(),
  };
}

const loadedEnv = loadDotEnv(envFile);
const mergedEnv = { ...process.env, ...loadedEnv, PRISMA_HIDE_UPDATE_MESSAGE: "true" };

const validate = run(process.execPath, ["node_modules/prisma/build/index.js", "validate", "--schema", "prisma/schema.prisma"], {
  env: mergedEnv,
});

const checks = {
  generatedAt: new Date().toISOString(),
  envFile,
  variables: {
    DATABASE_URL: {
      exists: Boolean(loadedEnv.DATABASE_URL || process.env.DATABASE_URL),
      info: describeUrl(loadedEnv.DATABASE_URL || process.env.DATABASE_URL || ""),
    },
    DIRECT_URL: {
      exists: Boolean(loadedEnv.DIRECT_URL || process.env.DIRECT_URL),
      info: describeUrl(loadedEnv.DIRECT_URL || process.env.DIRECT_URL || ""),
    },
    ZENO_INTERNAL_API_TOKEN: {
      exists: Boolean(loadedEnv.ZENO_INTERNAL_API_TOKEN || process.env.ZENO_INTERNAL_API_TOKEN),
      length: (loadedEnv.ZENO_INTERNAL_API_TOKEN || process.env.ZENO_INTERNAL_API_TOKEN || "").length,
    },
  },
  prismaValidate: {
    ok: validate.ok,
    output: [validate.stdout, validate.stderr].filter(Boolean).join("\n").trim(),
  },
  databaseConnectivity: [
    prismaExecute(loadedEnv.DIRECT_URL || process.env.DIRECT_URL, "DIRECT_URL", mergedEnv),
    prismaExecute(loadedEnv.DATABASE_URL || process.env.DATABASE_URL, "DATABASE_URL", mergedEnv),
  ],
};

checks.summary = {
  schemaValid: checks.prismaValidate.ok,
  directDbReachable: checks.databaseConnectivity.find((item) => item.label === "DIRECT_URL")?.ok ?? false,
  appDbReachable: checks.databaseConnectivity.find((item) => item.label === "DATABASE_URL")?.ok ?? false,
  internalTokenConfigured: checks.variables.ZENO_INTERNAL_API_TOKEN.exists,
  readyForMigration:
    checks.prismaValidate.ok &&
    (checks.databaseConnectivity.find((item) => item.label === "DIRECT_URL")?.ok ?? false),
  readyForLocalApiPush:
    checks.prismaValidate.ok &&
    (checks.databaseConnectivity.find((item) => item.label === "DATABASE_URL")?.ok ?? false) &&
    checks.variables.ZENO_INTERNAL_API_TOKEN.exists,
};

fs.writeFileSync(resultFile, `${JSON.stringify(checks, null, 2)}\n`, "utf8");
console.log(JSON.stringify(checks, null, 2));
