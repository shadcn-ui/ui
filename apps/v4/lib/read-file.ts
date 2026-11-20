import { promises as fs } from "fs"
import path from "path"

export async function readFileFromRoot(relativePath: string) {
  const absolutePath = path.join(
    /* turbopackIgnore: true */ process.cwd(),
    relativePath
  )
  return fs.readFile(/* turbopackIgnore: true */ absolutePath, "utf-8")
}
