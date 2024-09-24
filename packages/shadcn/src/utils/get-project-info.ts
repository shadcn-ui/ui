import path from "path"
import { FRAMEWORKS, Framework } from "@/src/utils/frameworks"
import {
  Config,
  RawConfig,
  getConfig,
  resolveConfigPaths,
} from "@/src/utils/get-config"
import { getPackageInfo } from "@/src/utils/get-package-info"
import { REGISTRY_URL } from "@/src/utils/registry"
import fg from "fast-glob"
import fs from "fs-extra"
import { loadConfig } from "tsconfig-paths"

type ProjectInfo = {
  framework: Framework
  isSrcDir: boolean
  isRSC: boolean
  isTsx: boolean
  tailwindConfigFile: string | null
  tailwindCssFile: string | null
  aliasPrefix: string | null
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
    isSrcDir,
    isTsx,
    tailwindConfigFile,
    tailwindCssFile,
    aliasPrefix,
    packageJson,
  ] = await Promise.all([
    fg.glob("**/{next,vite,astro}.config.*|gatsby-config.*|composer.json", {
      cwd,
      deep: 3,
      ignore: PROJECT_SHARED_IGNORE,
    }),
    fs.pathExists(path.resolve(cwd, "src")),
    isTypeScriptProject(cwd),
    getTailwindConfigFile(cwd),
    getTailwindCssFile(cwd),
    getTsConfigAliasPrefix(cwd),
    getPackageInfo(cwd, false),
  ])

  const isUsingAppDir = await fs.pathExists(
    path.resolve(cwd, `${isSrcDir ? "src/" : ""}app`)
  )

  const type: ProjectInfo = {
    framework: FRAMEWORKS["manual"],
    isSrcDir,
    isRSC: false,
    isTsx,
    tailwindConfigFile,
    tailwindCssFile,
    aliasPrefix,
  }

  // Next.js.
  if (configFiles.find((file) => file.startsWith("next.config."))?.length) {
    type.framework = isUsingAppDir
      ? FRAMEWORKS["next-app"]
      : FRAMEWORKS["next-pages"]
    type.isRSC = isUsingAppDir
    return type
  }

  // Astro.
  if (configFiles.find((file) => file.startsWith("astro.config."))?.length) {
    type.framework = FRAMEWORKS["astro"]
    return type
  }

  // Gatsby.
  if (configFiles.find((file) => file.startsWith("gatsby-config."))?.length) {
    type.framework = FRAMEWORKS["gatsby"]
    return type
  }

  // Laravel.
  if (configFiles.find((file) => file.startsWith("composer.json"))?.length) {
    type.framework = FRAMEWORKS["laravel"]
    return type
  }

  // Remix.
  if (
    Object.keys(packageJson?.dependencies ?? {}).find((dep) =>
      dep.startsWith("@remix-run/")
    )
  ) {
    type.framework = FRAMEWORKS["remix"]
    return type
  }

  // Vite.
  // Some Remix templates also have a vite.config.* file.
  // We'll assume that it got caught by the Remix check above.
  if (configFiles.find((file) => file.startsWith("vite.config."))?.length) {
    type.framework = FRAMEWORKS["vite"]
    return type
  }

  return type
}

export async function getTailwindCssFile(cwd: string) {
  const files = await fg.glob(["**/*.css", "**/*.scss"], {
    cwd,
    deep: 5,
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
      paths.includes("./app/*") ||
      paths.includes("./resources/js/*") // Laravel.
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

export async function getProjectConfig(
  cwd: string,
  defaultProjectInfo: ProjectInfo | null = null
): Promise<[Config, boolean] | null> {
  // Check for existing component config.
  const [existingConfig, projectInfo] = await Promise.all([
    getConfig(cwd),
    !defaultProjectInfo
      ? getProjectInfo(cwd)
      : Promise.resolve(defaultProjectInfo),
  ])

  if (existingConfig) {
    return [{ ...existingConfig, url: REGISTRY_URL }, false]
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
    rsc: projectInfo.isRSC,
    tsx: projectInfo.isTsx,
    style: "new-york",
    tailwind: {
      config: projectInfo.tailwindConfigFile,
      baseColor: "zinc",
      css: projectInfo.tailwindCssFile,
      cssVariables: true,
      prefix: "",
    },
    aliases: {
      components: `${projectInfo.aliasPrefix}/components`,
      ui: `${projectInfo.aliasPrefix}/components/ui`,
      hooks: `${projectInfo.aliasPrefix}/hooks`,
      lib: `${projectInfo.aliasPrefix}/lib`,
      utils: `${projectInfo.aliasPrefix}/lib/utils`,
    },
    url: REGISTRY_URL,
  }

  return [await resolveConfigPaths(cwd, config), true] as any
}
