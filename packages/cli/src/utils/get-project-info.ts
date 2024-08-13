import { existsSync } from "fs"
import path from "path"
import {
  Config,
  RawConfig,
  getConfig,
  resolveConfigPaths,
} from "@/src/utils/get-config"
import fg from "fast-glob"
import fs, { pathExists } from "fs-extra"
import { loadConfig } from "tsconfig-paths"

// TODO: Add support for more frameworks.
// We'll start with Next.js for now.
const PROJECT_TYPES = [
  "next-app",
  "next-pages",
  "remix",
  "astro",
  "vite",
] as const

type ProjectType = {
  framework: (typeof PROJECT_TYPES)[number]
  isUsingSrcDir: boolean
  isTypescript: boolean
}

const PROJECT_SHARED_IGNORE = [
  "**/node_modules/**",
  ".next",
  "public",
  "dist",
  "build",
]

export async function getProjectInfo() {
  const info = {
    tsconfig: null,
    srcDir: false,
    appDir: false,
    srcComponentsUiDir: false,
    componentsUiDir: false,
  }

  try {
    const tsconfig = await getTsConfig()

    return {
      tsconfig,
      srcDir: existsSync(path.resolve("./src")),
      appDir:
        existsSync(path.resolve("./app")) ||
        existsSync(path.resolve("./src/app")),
      srcComponentsUiDir: existsSync(path.resolve("./src/components/ui")),
      componentsUiDir: existsSync(path.resolve("./components/ui")),
    }
  } catch (error) {
    return info
  }
}

export async function getTsConfig() {
  try {
    const tsconfigPath = path.join("tsconfig.json")
    const tsconfig = await fs.readJSON(tsconfigPath)

    if (!tsconfig) {
      throw new Error("tsconfig.json is missing")
    }

    return tsconfig
  } catch (error) {
    return null
  }
}

export async function getProjectConfig(cwd: string): Promise<Config | null> {
  // Check for existing component config.
  const existingConfig = await getConfig(cwd)
  if (existingConfig) {
    return existingConfig
  }

  const projectType = await getProjectType(cwd)
  const tailwindCssFile = await getTailwindCssFile(cwd)
  const tsConfigAliasPrefix = await getTsConfigAliasPrefix(cwd)

  if (!projectType || !tailwindCssFile || !tsConfigAliasPrefix) {
    return null
  }

  const isTsx = await isTypeScriptProject(cwd)

  const config: RawConfig = {
    $schema: "https://ui.shadcn.com/schema.json",
    rsc: ["next-app", "next-app-src"].includes(projectType.framework),
    tsx: isTsx,
    style: "new-york",
    tailwind: {
      config: isTsx ? "tailwind.config.ts" : "tailwind.config.js",
      baseColor: "zinc",
      css: tailwindCssFile,
      cssVariables: true,
      prefix: "",
    },
    aliases: {
      utils: `${tsConfigAliasPrefix}/lib/utils`,
      components: `${tsConfigAliasPrefix}/components`,
    },
  }

  return await resolveConfigPaths(cwd, config)
}

export async function getProjectType(cwd: string): Promise<ProjectType | null> {
  const [configFiles, isUsingSrcDir, isTypescript] = await Promise.all([
    fg.glob("**/{next,vite,astro}.config.*", {
      cwd,
      deep: 3,
      ignore: PROJECT_SHARED_IGNORE,
    }),
    fs.pathExists(path.resolve(cwd, "src")),
    isTypeScriptProject(cwd),
  ])
  const isUsingAppDir = await fs.pathExists(
    path.resolve(cwd, `${isUsingSrcDir ? "src/" : ""}app`)
  )

  if (!configFiles.length) {
    return null
  }

  const type: ProjectType = {
    framework: "next-app",
    isUsingSrcDir,
    isTypescript,
  }

  // Next.js.
  if (configFiles.find((file) => file.startsWith("next.config."))?.length) {
    type.framework = isUsingAppDir ? "next-app" : "next-pages"
    return type
  }

  // Astro.
  if (configFiles.find((file) => file.startsWith("astro.config."))?.length) {
    type.framework = "astro"
    type.isTypescript = true
    return type
  }

  // Vite and Remix.
  // They both have a vite.config.* file.
  if (configFiles.find((file) => file.startsWith("vite.config."))?.length) {
    // We'll assume that if the project has an app dir, it's a Remix project.
    // Otherwise, it's a Vite project.
    // TODO: Maybe check for `@remix-run/react` in package.json?
    type.framework = isUsingAppDir ? "remix" : "vite"
    return type
  }

  return null
}

export async function getTailwindCssFile(cwd: string) {
  const files = await fg.glob("**/*.css", {
    cwd,
    deep: 3,
    ignore: PROJECT_SHARED_IGNORE,
  })

  if (!files.length) {
    return null
  }

  for (const file of files) {
    const contents = await fs.readFile(path.resolve(cwd, file), "utf8")
    // Assume that if the file contains `@tailwind base` it's the main css file.
    if (contents.includes("@tailwind base")) {
      return file
    }
  }

  return null
}

export async function getTsConfigAliasPrefix(cwd: string) {
  const tsConfig = await loadConfig(cwd)

  if (tsConfig?.resultType === "failed" || !tsConfig?.paths) {
    return null
  }

  // This assume that the first alias is the prefix.
  for (const [alias, paths] of Object.entries(tsConfig.paths)) {
    if (paths.includes("./*") || paths.includes("./src/*")) {
      return alias.at(0)
    }
  }

  return null
}

export async function isTypeScriptProject(cwd: string) {
  // Check if cwd has a tsconfig.json file.
  return pathExists(path.resolve(cwd, "tsconfig.json"))
}

export async function preFlight(cwd: string) {
  // We need Tailwind CSS to be configured.
  const tailwindConfig = await fg.glob("tailwind.config.*", {
    cwd,
    deep: 3,
    ignore: PROJECT_SHARED_IGNORE,
  })

  if (!tailwindConfig.length) {
    throw new Error(
      "Tailwind CSS is not installed. Visit https://tailwindcss.com/docs/installation to get started."
    )
  }

  return true
}
