import { Config } from "@/src/get-config"
import { registryBaseColorSchema } from "@/src/registry/schema"
import {
  getTextFromFirstToken,
  stripByteOrderMark,
} from "@/src/transformers/source-text"
import { transformCssVars } from "@/src/transformers/transform-css-vars"
import { transformIcons } from "@/src/transformers/transform-icons"
import { transformImport } from "@/src/transformers/transform-import"
import { transformJsx } from "@/src/transformers/transform-jsx"
import { transformRsc } from "@/src/transformers/transform-rsc"
import { z } from "zod"

import { transformCleanup } from "./transform-cleanup"
import { transformRtl } from "./transform-rtl"
import { transformTwPrefixes } from "./transform-tw-prefix"

export type TransformOpts = {
  filename: string
  raw: string
  config: Config
  baseColor?: z.infer<typeof registryBaseColorSchema>
  transformJsx?: boolean
  isRemote?: boolean
  supportedFontMarkers?: string[]
}

export type Transformer = (
  code: string,
  opts: TransformOpts
) => string | Promise<string>

// Runs the transformers on raw, one after the other, as the ts-morph runner
// did on a SourceFile, and returns what it returned: the text from the first
// token, or transformJsx's output.
export async function transform(
  opts: TransformOpts,
  transformers: Transformer[] = [
    transformImport,
    transformRsc,
    transformCssVars,
    transformTwPrefixes,
    transformRtl,
    transformIcons,
    transformCleanup,
  ]
) {
  let code = stripByteOrderMark(opts.raw)
  for (const transformer of transformers) {
    code = await transformer(code, opts)
  }

  if (opts.transformJsx) {
    return await transformJsx(code, opts)
  }

  return getTextFromFirstToken(code)
}
