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

const SUPPORTED_FRAMEWORKS = [
  "next-app",
  "next-pages",
  "remix",
  "vite",
] as const

type ProjectInfo = {
  framework: (typeof SUPPORTED_FRAMEWORKS)[number]
  isUsingSrcDir: boolean
  isTypescript: boolean
  tailwindConfigFile: string | null
  tailwindCssFile: string | null
  tsConfigAliasPrefix: string | null
}

const PROJECT_SHARED_IGNORE = [
  "**/node_modules/**",
  ".next",
  "public",
  "dist",
  "build",
]

export async function getProjectInfo(cwd: string): Promise<ProjectInfo | null> {
  const [
    configFiles,
    isUsingSrcDir,
    isTypescript,
    tailwindConfigFile,
    tailwindCssFile,
    tsConfigAliasPrefix,
  ] = await Promise.all([
    fg.glob("**/{next,vite,astro}.config.*", {
      cwd,
      deep: 3,
      ignore: PROJECT_SHARED_IGNORE,
    }),
    fs.pathExists(path.resolve(cwd, "src")),
    isTypeScriptProject(cwd),
    getTailwindConfigFile(cwd),
    getTailwindCssFile(cwd),
    getTsConfigAliasPrefix(cwd),
  ])

  const isUsingAppDir = await fs.pathExists(
    path.resolve(cwd, `${isUsingSrcDir ? "src/" : ""}app`)
  )

  if (!configFiles.length) {
    return null
  }

  const type: ProjectInfo = {
    framework: "next-app",
    isUsingSrcDir,
    isTypescript,
    tailwindConfigFile,
    tailwindCssFile,
    tsConfigAliasPrefix,
  }

  // Next.js.
  if (configFiles.find((file) => file.startsWith("next.config."))?.length) {
    type.framework = isUsingAppDir ? "next-app" : "next-pages"
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

export async function getTailwindConfigFile(cwd: string) {
  const files = await fg.glob("tailwind.config.*", {
    cwd,
    deep: 3,
    ignore: PROJECT_SHARED_IGNORE,
  })

  if (!files.length) {
    return null
  }

  return files[0]
}

export async function getTsConfigAliasPrefix(cwd: string) {
  const tsConfig = await loadConfig(cwd)

  if (tsConfig?.resultType === "failed" || !tsConfig?.paths) {
    return null
  }

  // This assume that the first alias is the prefix.
  for (const [alias, paths] of Object.entries(tsConfig.paths)) {
    if (
      paths.includes("./*") ||
      paths.includes("./src/*") ||
      paths.includes("./app/*")
    ) {
      return alias.at(0) ?? null
    }
  }

  return null
}

export async function isTypeScriptProject(cwd: string) {
  const files = await fg.glob("tsconfig.*", {
    cwd,
    deep: 1,
    ignore: PROJECT_SHARED_IGNORE,
  })

  return files.length > 0
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
  const [existingConfig, projectInfo] = await Promise.all([
    getConfig(cwd),
    getProjectInfo(cwd),
  ])

  if (existingConfig) {
    return existingConfig
  }

  if (
    !projectInfo ||
    !projectInfo.tailwindConfigFile ||
    !projectInfo.tailwindCssFile
  ) {
    return null
  }

  const config: RawConfig = {
    $schema: "https://ui.shadcn.com/schema.json",
    rsc: ["next-app", "next-app-src"].includes(projectInfo.framework),
    tsx: projectInfo.isTypescript,
    style: "new-york",
    tailwind: {
      config: projectInfo.tailwindConfigFile,
      baseColor: "zinc",
      css: projectInfo.tailwindCssFile,
      cssVariables: true,
      prefix: "",
    },
    aliases: {
      utils: `${projectInfo.tsConfigAliasPrefix}/lib/utils`,
      components: `${projectInfo.tsConfigAliasPrefix}/components`,
    },
  }

  return await resolveConfigPaths(cwd, config)
}
