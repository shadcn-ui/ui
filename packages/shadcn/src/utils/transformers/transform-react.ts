import { Transformer } from "@/src/utils/transformers"
import { transform } from "ts-morph-react"

export const transformReact: Transformer = async ({ sourceFile, config }) => {
  if (!config.tsx) {
    return sourceFile
  }
  await transform(sourceFile, { ...config.transform })
  return sourceFile
}
