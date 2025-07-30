import path from "path"
import { rimraf } from "rimraf"

export const TEMP_DIR = path.join(__dirname, "../../temp")

export default async function setup() {
  return async () => {
    await rimraf(TEMP_DIR)
  }
}
