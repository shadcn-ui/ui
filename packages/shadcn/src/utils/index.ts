import { transformFont as transformFontText } from "@shadcn/registry/internal/transformers/transform-font"
import { transformIcons as transformIconsText } from "@shadcn/registry/internal/transformers/transform-icons"
import { transformMenu as transformMenuText } from "@shadcn/registry/internal/transformers/transform-menu"

import { fromTextTransformer } from "../utils/transformers/source-file"

export { createStyleMap } from "../styles/create-style-map"
export { transformStyle } from "../styles/transform"
export { transformRenderSourceFile as transformRender } from "../utils/transformers/transform-render"
export { transformDirection } from "@shadcn/registry/internal/transformers/transform-rtl"

// The registry's transformers take and return text. These keep the signature
// they had: a ts-morph SourceFile in, the new text left in it.
export const transformFont = fromTextTransformer(transformFontText)
export const transformIcons = fromTextTransformer(transformIconsText)
export const transformMenu = fromTextTransformer(transformMenuText)
