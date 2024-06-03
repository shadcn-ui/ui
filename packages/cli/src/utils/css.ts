import { Config } from "@/src/utils/get-config"
import { registryBaseColorSchema } from "@/src/utils/registry/schema"
import { applyPrefixesCss } from "@/src/utils/transformers/transform-tw-prefix"
import * as z from "zod"

// This does a simple string replacement.
// TODO: Do we want to use a proper CSS transformer here? Probably not right now.
export function applyCSSUpdates(
  input: string,
  baseColor: Pick<z.infer<typeof registryBaseColorSchema>, "cssVars">,
  config: Partial<Config>
) {
  if (!isCSSUpdateRequired(input, config)) {
    return input
  }

  let output = input
  // Check if the file contains the `@tailwind` directives.
  // We assume it does since Tailwind CSS is checked in preflight.
  if (!input.includes("@tailwind base")) {
    // Prepend the `@tailwind` directives.
    output = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n${input}`
  }

  // No additional changes if not using CSS variables.
  if (!config.tailwind?.cssVariables) {
    return output
  }

  const lightColors = Object.entries(baseColor.cssVars.light).map(
    ([name, value]) => `    --${name}: ${value};`
  )
  const darkColors = Object.entries(baseColor.cssVars.dark).map(
    ([name, value]) => `    --${name}: ${value};`
  )

  output = output.replace(
    /@tailwind utilities;/,
    `@tailwind utilities;\n
@layer base {
  :root {
${lightColors.join("\n")}
  }

  .dark {
${darkColors.join("\n")}
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`
  )

  if (config.tailwind.prefix) {
    output = applyPrefixesCss(output, config.tailwind.prefix)
  }

  return output
}

function isCSSUpdateRequired(input: string, config: Partial<Config>) {
  // Check for tailwind directives.
  const hasTailwindDirectives =
    input.includes("@tailwind base") &&
    input.includes("@tailwind utilities") &&
    input.includes("@tailwind components")

  // If we're not using CSS variables, we only check for the `@tailwind` directives.
  if (!config.tailwind?.cssVariables) {
    return !hasTailwindDirectives
  }

  // If we are using CSS variables, we check for the `@layer base` directives.
  // And we check for the `--background` and `--foreground` variables.
  return !(
    input.includes("@layer base") &&
    input.includes("--background") &&
    input.includes("--foreground")
  )
}
