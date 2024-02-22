const fs = require("node:fs/promises");
const path = require("node:path");

fs.copyFile(
  path.resolve(process.cwd(), "node_modules/typed-redux-saga/types/index.d.ts"),
  path.resolve(process.cwd(), "dist/index.d.ts")
);
