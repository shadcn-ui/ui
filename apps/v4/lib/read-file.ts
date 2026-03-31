import { promises as fs } from "fs"
import path from "path"

export async function readFileFromRoot(relativePath: string) {
  const absolutePath = path.join(process.cwd(), relativePath)
  try {
    return await fs.readFile(absolutePath, "utf-8")
  } catch {
    return undefined
  }
}
