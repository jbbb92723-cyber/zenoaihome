import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const hubDir = path.join(projectRoot, "ops", "zeno-lark");
const args = process.argv.slice(2);

const result = spawnSync("node", ["zeno-command-router.mjs", ...args], {
  cwd: hubDir,
  stdio: "inherit",
  shell: false,
});

process.exitCode = result.status ?? 1;
