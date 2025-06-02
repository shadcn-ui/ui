import path from "path"
import { FRAMEWORKS, Framework } from "@/src/utils/frameworks"
import {
  Config,
  RawConfig,
  getConfig,
  resolveConfigPaths,
} from "@/src/utils/get-config"
import { getPackageInfo } from "@/src/utils/get-package-info"
import fg from "fast-glob"
import fs from "fs-extra"
import { loadConfig } from "tsconfig-paths"
import { z } from "zod"

export type TailwindVersion = "v3" | "v4" | null

export type ProjectInfo = {
  framework: Framework
  isSrcDir: boolean
  isRSC: boolean
  isTsx: boolean
  tailwindConfigFile: string | null
  tailwindCssFile: string | null
  tailwindVersion: TailwindVersion
  aliasPrefix: string | null
}

const PROJECT_SHARED_IGNORE = [
  "**/node_modules/**",
  ".next",
  "public",
  "dist",
  "build",
]

const TS_CONFIG_SCHEMA = z.object({
  compilerOptions: z.object({
    paths: z.record(z.string().or(z.array(z.string()))),
  }),
})

export async function getProjectInfo(cwd: string): Promise<ProjectInfo | null> {
  const [
    configFiles,
    isSrcDir,
    isTsx,
    tailwindConfigFile,
    tailwindCssFile,
    tailwindVersion,
    aliasPrefix,
    packageJson,
  ] = await Promise.all([
    fg.glob(
      "**/{next,vite,astro,app}.config.*|gatsby-config.*|composer.json|react-router.config.*",
      {
        cwd,
        deep: 3,
        ignore: PROJECT_SHARED_IGNORE,
      }
    ),
    fs.pathExists(path.resolve(cwd, "src")),
    isTypeScriptProject(cwd),
    getTailwindConfigFile(cwd),
    getTailwindCssFile(cwd),
    getTailwindVersion(cwd),
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
    tailwindVersion,
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

  // TanStack Start.
  if (
    configFiles.find((file) => file.startsWith("app.config."))?.length &&
    [
      ...Object.keys(packageJson?.dependencies ?? {}),
      ...Object.keys(packageJson?.devDependencies ?? {}),
    ].find((dep) => dep.startsWith("@tanstack/start"))
  ) {
    type.framework = FRAMEWORKS["tanstack-start"]
    return type
  }

  // React Router.
  if (
    configFiles.find((file) => file.startsWith("react-router.config."))?.length
  ) {
    type.framework = FRAMEWORKS["react-router"]
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

export async function getTailwindVersion(
  cwd: string
): Promise<ProjectInfo["tailwindVersion"]> {
  const [packageInfo, config] = await Promise.all([
    getPackageInfo(cwd, false),
    getConfig(cwd),
  ])

  // If the config file is empty, we can assume that it's a v4 project.
  if (config?.tailwind?.config === "") {
    return "v4"
  }

  if (
    !packageInfo?.dependencies?.tailwindcss &&
    !packageInfo?.devDependencies?.tailwindcss
  ) {
    return null
  }

  if (
    /^(?:\^|~)?3(?:\.\d+)*(?:-.*)?$/.test(
      packageInfo?.dependencies?.tailwindcss ||
        packageInfo?.devDependencies?.tailwindcss ||
        ""
    )
  ) {
    return "v3"
  }

  return "v4"
}

export async function getTailwindCssFile(cwd: string) {
  const [files, tailwindVersion] = await Promise.all([
    fg.glob(["**/*.css", "**/*.scss"], {
      cwd,
      deep: 5,
      ignore: PROJECT_SHARED_IGNORE,
    }),
    getTailwindVersion(cwd),
  ])

  if (!files.length) {
    return null
  }

  const needle =
    tailwindVersion === "v4" ? `@import "tailwindcss"` : "@tailwind base"
  for (const file of files) {
    const contents = await fs.readFile(path.resolve(cwd, file), "utf8")
    if (
      contents.includes(`@import "tailwindcss"`) ||
      contents.includes(`@import 'tailwindcss'`) ||
      contents.includes(`@tailwind base`)
    ) {
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

  if (
    tsConfig?.resultType === "failed" ||
    !Object.entries(tsConfig?.paths).length
  ) {
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
      return alias.replace(/\/\*$/, "") ?? null
    }
  }

  // Use the first alias as the prefix.
  return Object.keys(tsConfig?.paths)?.[0].replace(/\/\*$/, "") ?? null
}

export async function isTypeScriptProject(cwd: string) {
  const files = await fg.glob("tsconfig.*", {
    cwd,
    deep: 1,
    ignore: PROJECT_SHARED_IGNORE,
  })

  return files.length > 0
}

export async function getTsConfig(cwd: string) {
  for (const fallback of [
    "tsconfig.json",
    "tsconfig.web.json",
    "tsconfig.app.json",
  ]) {
    const filePath = path.resolve(cwd, fallback)
    if (!(await fs.pathExists(filePath))) {
      continue
    }

    // We can't use fs.readJSON because it doesn't support comments.
    const contents = await fs.readFile(filePath, "utf8")
    const cleanedContents = contents.replace(/\/\*\s*\*\//g, "")
    const result = TS_CONFIG_SCHEMA.safeParse(JSON.parse(cleanedContents))

    if (result.error) {
      continue
    }

    return result.data
  }

  return null
}

export async function getProjectConfig(
  cwd: string,
  defaultProjectInfo: ProjectInfo | null = null
): Promise<Config | null> {
  // Check for existing component config.
  const [existingConfig, projectInfo] = await Promise.all([
    getConfig(cwd),
    !defaultProjectInfo
      ? getProjectInfo(cwd)
      : Promise.resolve(defaultProjectInfo),
  ])

  if (existingConfig) {
    return existingConfig
  }

  if (
    !projectInfo ||
    !projectInfo.tailwindCssFile ||
    (projectInfo.tailwindVersion === "v3" && !projectInfo.tailwindConfigFile)
  ) {
    return null
  }

  const config: RawConfig = {
    $schema: "https://ui.shadcn.com/schema.json",
    rsc: projectInfo.isRSC,
    tsx: projectInfo.isTsx,
    style: "new-york",
    tailwind: {
      config: projectInfo.tailwindConfigFile ?? "",
      baseColor: "zinc",
      css: projectInfo.tailwindCssFile,
      cssVariables: true,
      prefix: "",
    },
    iconLibrary: "lucide",
    aliases: {
      components: `${projectInfo.aliasPrefix}/components`,
      ui: `${projectInfo.aliasPrefix}/components/ui`,
      hooks: `${projectInfo.aliasPrefix}/hooks`,
      lib: `${projectInfo.aliasPrefix}/lib`,
      utils: `${projectInfo.aliasPrefix}/lib/utils`,
    },
  }

  return await resolveConfigPaths(cwd, config)
}

export async function getProjectTailwindVersionFromConfig(
  config: Config
): Promise<TailwindVersion> {
  if (!config.resolvedPaths?.cwd) {
    return "v3"
  }

  const projectInfo = await getProjectInfo(config.resolvedPaths.cwd)

  if (!projectInfo?.tailwindVersion) {
    return null
  }

  return projectInfo.tailwindVersion
}
