import path from "path"
import { iconLibraries, type IconLibraryName } from "@/src/icons/libraries"
import { configWithDefaults } from "@/src/registry/config"
import { resolveRegistryTree } from "@/src/registry/resolver"
import { rawConfigSchema } from "@/src/schema"
import { addComponents } from "@/src/utils/add-components"
import { resolveConfigPaths } from "@/src/utils/get-config"
import { ensureRegistriesInConfig } from "@/src/utils/registries"
import { updateCssVars } from "@/src/utils/updaters/update-css-vars"
import { updateDependencies } from "@/src/utils/updaters/update-dependencies"
import { updateFonts } from "@/src/utils/updaters/update-fonts"
import deepmerge from "deepmerge"
import fsExtra from "fs-extra"

export async function initMonorepoProject(options: {
  projectPath: string
  components: string[]
  baseStyle: boolean
  baseColor: string
  registryBaseConfig?: Record<string, unknown>
  rtl: boolean
  silent: boolean
}) {
  const packagesUiPath = path.resolve(options.projectPath, "packages/ui")
  const appsWebPath = path.resolve(options.projectPath, "apps/web")

  // Update packages/ui/components.json.
  const packagesUiConfigPath = path.resolve(packagesUiPath, "components.json")
  let packagesUiConfig = await fsExtra.readJson(packagesUiConfigPath)
  if (options.registryBaseConfig) {
    packagesUiConfig = deepmerge(packagesUiConfig, options.registryBaseConfig)
  }
  packagesUiConfig.tailwind.baseColor = options.baseColor
  if (options.rtl) {
    packagesUiConfig.rtl = true
  }
  await fsExtra.writeJson(packagesUiConfigPath, packagesUiConfig, {
    spaces: 2,
  })

  // Update apps/web/components.json.
  const appsWebConfigPath = path.resolve(appsWebPath, "components.json")
  let appsWebConfig = await fsExtra.readJson(appsWebConfigPath)
  if (options.registryBaseConfig) {
    appsWebConfig = deepmerge(appsWebConfig, options.registryBaseConfig)
  }
  appsWebConfig.tailwind.baseColor = options.baseColor
  if (options.rtl) {
    appsWebConfig.rtl = true
  }
  await fsExtra.writeJson(appsWebConfigPath, appsWebConfig, { spaces: 2 })

  // Apply preset CSS/style to packages/ui directly.
  // We use the packages/ui config (not apps/web) so addProjectComponents runs
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
  await addComponents(options.components, packagesUiWithRegistries, {
    overwrite: true,
    silent: options.silent,
    isNewProject: true,
  })

  const resolvedAppsWebConfig = await resolveConfigPaths(
    appsWebPath,
    rawConfigSchema.parse(appsWebConfig)
  )

  // Handle fonts at the apps/web level.
  // packages/ui has no next.config so massageTreeForFonts can't detect Next.js.
  // We resolve the tree to get fonts, then apply them using the apps/web config
  // which has next.config and layout.tsx.
  const tree = await resolveRegistryTree(
    options.components,
    configWithDefaults(packagesUiWithRegistries)
  )
  if (tree?.fonts?.length) {
    const [fontSans] = tree.fonts

    // Add font CSS variable to packages/ui CSS (same as massageTreeForFonts for Next.js).
    await updateCssVars(
      { theme: { [fontSans.font.variable]: `var(${fontSans.font.variable})` } },
      resolvedPackagesUiConfig,
      {
        silent: options.silent,
        overwriteCssVars: false,
      }
    )

    // Update layout.tsx in apps/web with the font import and className.
    await updateFonts(tree.fonts, resolvedAppsWebConfig, {
      silent: options.silent,
    })
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
