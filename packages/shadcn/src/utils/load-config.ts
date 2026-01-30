// packages/shadcn/src/utils/load-config.ts
import fs from "fs"

export interface NormalizedConfig {
  style: string
  rsc: boolean
  tailwind: {
    config: string
    css: string
    baseColor: string
  }
  aliases: {
    components: string
    utils: string
  }
}

export function loadConfig(configPath: string): NormalizedConfig {
  const raw = JSON.parse(fs.readFileSync(configPath, "utf8"))

  return {
    style: raw.style ?? "default",
    rsc: raw.rsc ?? false,
    tailwind: {
      config: raw.tailwind?.config ?? "tailwind.config.ts",
      css: raw.tailwind?.css ?? "app/globals.css",
      baseColor: raw.tailwind?.baseColor ?? "slate",
    },
    aliases: raw.aliases ?? {
      components: "@/components",
      utils: "@/lib/utils",
    },
  }
}
