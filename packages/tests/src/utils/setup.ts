/* eslint-disable turbo/no-undeclared-env-vars */
import { tmpdir } from "os"
import path from "path"
import fs from "fs-extra"
import { rimraf } from "rimraf"

const TEMP_DIR = fs.mkdtempSync(path.join(tmpdir(), "shadcn-tests"))

console.log("TEMP_DIR", TEMP_DIR)

export async function setup() {
  await rimraf(TEMP_DIR)
  await fs.ensureDir(TEMP_DIR)
}

export async function teardown() {
  await rimraf(TEMP_DIR)
}
