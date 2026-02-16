import os from "os"
import path from "path"
import { iconLibraries, type IconLibraryName } from "@/src/icons/libraries"
import { configWithDefaults } from "@/src/registry/config"
import { resolveRegistryTree } from "@/src/registry/resolver"
import { rawConfigSchema } from "@/src/schema"
import { addComponents } from "@/src/utils/add-components"
import { resolveConfigPaths } from "@/src/utils/get-config"
import { handleError } from "@/src/utils/handle-error"
import { ensureRegistriesInConfig } from "@/src/utils/registries"
import { spinner } from "@/src/utils/spinner"
import { updateCssVars } from "@/src/utils/updaters/update-css-vars"
import { updateDependencies } from "@/src/utils/updaters/update-dependencies"
import { updateFonts } from "@/src/utils/updaters/update-fonts"
import dedent from "dedent"
import deepmerge from "deepmerge"
import { execa } from "execa"
import fs from "fs-extra"

import { GITHUB_TEMPLATE_URL, createTemplate } from "./create-template"

export const nextMonorepo = createTemplate({
  name: "next-monorepo",
  title: "Next.js (Monorepo)",
  defaultProjectName: "next-monorepo",
  scaffold: async ({ projectPath, packageManager }) => {
    const createSpinner = spinner(
      `Creating a new Next.js monorepo. This may take a few minutes.`
    ).start()

    try {
      const localTemplateDir = process.env.SHADCN_TEMPLATE_DIR
      if (localTemplateDir) {
        // Use local template directory for development.
        const localTemplatePath = path.resolve(
          localTemplateDir,
          "next-monorepo"
        )
        await fs.copy(localTemplatePath, projectPath, {
          filter: (src) => !src.includes("node_modules"),
        })
      } else {
        // Get the template from GitHub.
        const templatePath = path.join(
          os.tmpdir(),
          `shadcn-template-${Date.now()}`
        )
        await fs.ensureDir(templatePath)
        const response = await fetch(GITHUB_TEMPLATE_URL)
        if (!response.ok) {
          throw new Error(`Failed to download template: ${response.statusText}`)
        }

        // Write the tar file.
        const tarPath = path.resolve(templatePath, "template.tar.gz")
        await fs.writeFile(tarPath, Buffer.from(await response.arrayBuffer()))
        await execa("tar", [
          "-xzf",
          tarPath,
          "-C",
          templatePath,
          "--strip-components=2",
          "ui-main/templates/next-monorepo",
        ])
        const extractedPath = path.resolve(templatePath, "next-monorepo")
        await fs.move(extractedPath, projectPath)
        await fs.remove(templatePath)
      }

      // Run install. pnpm enables frozen lockfile in CI by default.
      // The template lockfile may drift, so force-disable it explicitly.
      const installArgs = ["install"]
      if (packageManager === "pnpm") {
        installArgs.push("--no-frozen-lockfile")
      }

      await execa(packageManager, installArgs, {
        cwd: projectPath,
        env: {
          ...process.env,
        },
      })

      // Write project name to the package.json.
      const packageJsonPath = path.join(projectPath, "package.json")
      if (fs.existsSync(packageJsonPath)) {
        const packageJsonContent = await fs.readFile(packageJsonPath, "utf8")
        const packageJson = JSON.parse(packageJsonContent)
        packageJson.name = projectPath.split("/").pop()
        await fs.writeFile(
          packageJsonPath,
          JSON.stringify(packageJson, null, 2)
        )
      }

      createSpinner?.succeed("Creating a new Next.js monorepo.")
    } catch (error) {
      createSpinner?.fail(
        "Something went wrong creating a new Next.js monorepo."
      )
      handleError(error)
    }
  },
  create: async () => {
    // Empty for now.
  },
  init: async (options) => {
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
    await fs.writeJson(appsWebConfigPath, appsWebConfig, { spaces: 2 })

    // Apply preset CSS/style to packages/ui directly.
    // We use the packages/ui config (not apps/web) so addProjectComponents runs.
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
    // Skip fonts here — we handle them explicitly below using the apps/web config.
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

    // Handle fonts at the apps/web level.
    // packages/ui has no next.config so massageTreeForFonts can't detect Next.js.
    // We resolve the tree to get fonts, then apply them using the apps/web config.
    // which has next.config and layout.tsx.
    const tree = await resolveRegistryTree(
      options.components,
      configWithDefaults(packagesUiWithRegistries)
    )
    if (tree?.fonts?.length) {
      const [fontSans] = tree.fonts

      // Add font CSS variable to packages/ui CSS (same as massageTreeForFonts for Next.js).
      await updateCssVars(
        {
          theme: { [fontSans.font.variable]: `var(${fontSans.font.variable})` },
        },
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
  },
  files: [
    {
      type: "registry:page",
      path: "app/page.tsx",
      target: "app/page.tsx",
      content: dedent`import { ComponentExample } from "@/components/component-example";

export default function Page() {
  return <ComponentExample />;
}
`,
    },
  ],
})
