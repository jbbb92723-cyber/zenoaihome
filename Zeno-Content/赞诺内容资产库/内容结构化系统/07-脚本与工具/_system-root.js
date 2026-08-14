#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function resolveSystemRoot() {
  const current = path.resolve(process.cwd());
  const hasSystemMarkers =
    fs.existsSync(path.join(current, "00-规则与索引")) &&
    fs.existsSync(path.join(current, "02-内容单元库"));

  return hasSystemMarkers ? current : path.resolve(__dirname, "..");
}

module.exports = { resolveSystemRoot };
