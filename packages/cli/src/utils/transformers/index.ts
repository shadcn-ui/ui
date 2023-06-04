import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import { Config } from "@/src/utils/get-config"
import { transformRsc } from "@/src/utils/transformers/transform-rsc"
import { Project, type SourceFile } from "ts-morph"

import { transformImport } from "./transform-import"

export type Transformer = (opts: {
  sourceFile: SourceFile
  filename: string
  raw: string
  config: Config
}) => Promise<SourceFile>

const transformers: Transformer[] = [transformImport, transformRsc]

const project = new Project()

async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-"))
  return path.join(dir, filename)
}

export async function transform(filename: string, raw: string, config: Config) {
  const tempFile = await createTempSourceFile(filename)
  const sourceFile = project.createSourceFile(tempFile, raw)

  for (const transformer of transformers) {
    transformer({ sourceFile, filename, raw, config })
  }

  return sourceFile.getFullText()
}
