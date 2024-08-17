import { promises as fs } from "fs"
import { Config } from "@/src/utils/get-config"
import { getRegistryBaseColor } from "@/src/utils/registry"
import { applyPrefixesCss } from "@/src/utils/transformers/transform-tw-prefix"

export async function initializeTailwindCss(config: Config) {
  // Write css file.
  const baseColor = await getRegistryBaseColor(config.tailwind.baseColor)
  if (baseColor) {
    await fs.writeFile(
      config.resolvedPaths.tailwindCss,
      config.tailwind.cssVariables
        ? config.tailwind.prefix
          ? applyPrefixesCss(baseColor.cssVarsTemplate, config.tailwind.prefix)
          : baseColor.cssVarsTemplate
        : baseColor.inlineColorsTemplate,
      "utf8"
    )
  }
}
