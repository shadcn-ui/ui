import path from "path"
import { iconLibraries, type IconLibraryName } from "@/src/icons/libraries"
import { configWithDefaults } from "@/src/registry/config"
import { resolveRegistryTree } from "@/src/registry/resolver"
import { rawConfigSchema } from "@/src/schema"
import { addComponents } from "@/src/utils/add-components"
import { resolveConfigPaths } from "@/src/utils/get-config"
import { ensureRegistriesInConfig } from "@/src/utils/registries"
import { updateCss } from "@/src/utils/updaters/update-css"
import { updateCssVars } from "@/src/utils/updaters/update-css-vars"
import { updateDependencies } from "@/src/utils/updaters/update-dependencies"
import deepmerge from "deepmerge"
import fs from "fs-extra"

import type { TemplateInitOptions } from "./create-template"

// Shared monorepo init for non-Next.js templates (vite, react-router, start).
// Uses fontsource for fonts instead of next/font.
export async function fontsourceMonorepoInit(options: TemplateInitOptions) {
  const packagesUiPath = path.resolve(options.projectPath, "packages/ui")
  const appsWebPath = path.resolve(options.projectPath, "apps/web")

  // Update packages/ui/components.json.
  const packagesUiConfigPath = path.resolve(packagesUiPath, "components.json")
  let packagesUiConfig = await fs.readJson(packagesUiConfigPath)
  if (options.registryBaseConfig) {
    packagesUiConfig = deepmerge(packagesUiConfig, options.registryBaseConfig)
  }
  packagesUiConfig.tailwind.baseColor = "neutral"
  if (options.rtl) {
    packagesUiConfig.rtl = true
  }
  if (options.menuColor) {
    packagesUiConfig.menuColor = options.menuColor
  }
  if (options.menuAccent) {
    packagesUiConfig.menuAccent = options.menuAccent
  }
  if (options.iconLibrary) {
    packagesUiConfig.iconLibrary = options.iconLibrary
  }
  await fs.writeJson(packagesUiConfigPath, packagesUiConfig, {
    spaces: 2,
  })

  // Update apps/web/components.json.
  const appsWebConfigPath = path.resolve(appsWebPath, "components.json")
  let appsWebConfig = await fs.readJson(appsWebConfigPath)
  if (options.registryBaseConfig) {
    appsWebConfig = deepmerge(appsWebConfig, options.registryBaseConfig)
  }
  appsWebConfig.tailwind.baseColor = "neutral"
  if (options.rtl) {
    appsWebConfig.rtl = true
  }
  if (options.menuColor) {
    appsWebConfig.menuColor = options.menuColor
  }
  if (options.menuAccent) {
    appsWebConfig.menuAccent = options.menuAccent
  }
  if (options.iconLibrary) {
    appsWebConfig.iconLibrary = options.iconLibrary
  }
  await fs.writeJson(appsWebConfigPath, appsWebConfig, { spaces: 2 })

  // Apply preset CSS/style to packages/ui directly.
  // We use the packages/ui config so addProjectComponents runs
  // instead of addWorkspaceComponents. This keeps CSS/deps in packages/ui.
  const resolvedPackagesUiConfig = await resolveConfigPaths(
    packagesUiPath,
    rawConfigSchema.parse(packagesUiConfig)
  )
  const { config: packagesUiWithRegistries } = await ensureRegistriesInConfig(
    options.components,
    resolvedPackagesUiConfig,
    { silent: true }
  )
  // Skip fonts here — we handle them explicitly below.
  await addComponents(options.components, packagesUiWithRegistries, {
    overwrite: true,
    silent: options.silent,
    isNewProject: true,
    skipFonts: true,
  })

  const resolvedAppsWebConfig = await resolveConfigPaths(
    appsWebPath,
    rawConfigSchema.parse(appsWebConfig)
  )

  // Handle fonts at the packages/ui level using fontsource.
  // packages/ui has no framework config, so massageTreeForFonts can't detect the framework.
  // We resolve the tree to get fonts and manually add fontsource deps + CSS.
  const tree = await resolveRegistryTree(
    options.components,
    configWithDefaults(packagesUiWithRegistries)
  )
  if (tree?.fonts?.length) {
    const [fontSans] = tree.fonts

    // Add fontsource dependency.
    const fontName = fontSans.name.replace("font-", "")
    const fontSourceDependency = `@fontsource-variable/${fontName}`
    await updateDependencies(
      [fontSourceDependency],
      [],
      resolvedPackagesUiConfig,
      { silent: true }
    )

    // Add font CSS variable to @theme inline in packages/ui CSS.
    await updateCssVars(
      {
        theme: {
          [fontSans.font.variable]: fontSans.font.family,
        },
      },
      resolvedPackagesUiConfig,
      {
        silent: options.silent,
        overwriteCssVars: false,
        tailwindVersion: "v4",
      }
    )

    // Add fontsource import to packages/ui CSS.
    await updateCss(
      {
        [`@import "${fontSourceDependency}"`]: {},
      },
      resolvedPackagesUiConfig,
      {
        silent: options.silent,
      }
    )
  }

  // Install icon library packages in both workspaces.
  const iconLibrary = resolvedPackagesUiConfig.iconLibrary as IconLibraryName
  if (iconLibrary && iconLibrary in iconLibraries) {
    const iconPackages = [...iconLibraries[iconLibrary].packages]
    await updateDependencies(iconPackages, [], resolvedPackagesUiConfig, {
      silent: true,
    })
    await updateDependencies(iconPackages, [], resolvedAppsWebConfig, {
      silent: true,
    })
  }

  return resolvedAppsWebConfig
}
