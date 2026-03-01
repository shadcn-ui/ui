import os from "os"
import path from "path"
import { handleError } from "@/src/utils/handle-error"
import { spinner } from "@/src/utils/spinner"
import dedent from "dedent"
import { execa } from "execa"
import fs from "fs-extra"

import { GITHUB_TEMPLATE_URL, createTemplate } from "./create-template"

export const vite = createTemplate({
  name: "vite",
  title: "Vite",
  defaultProjectName: "vite-app",
  frameworks: ["vite"],
  scaffold: async ({ projectPath, packageManager }) => {
    const createSpinner = spinner(
      `Creating a new Vite project. This may take a few minutes.`
    ).start()

    try {
      const localTemplateDir = process.env.SHADCN_TEMPLATE_DIR
      if (localTemplateDir) {
        // Use local template directory for development.
        const localTemplatePath = path.resolve(localTemplateDir, "vite-app")
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
          "ui-main/templates/vite-app",
        ])
        const extractedPath = path.resolve(templatePath, "vite-app")
        await fs.move(extractedPath, projectPath)
        await fs.remove(templatePath)
      }

      // Remove pnpm-lock.yaml if using a different package manager.
      if (packageManager !== "pnpm") {
        const lockFilePath = path.join(projectPath, "pnpm-lock.yaml")
        if (fs.existsSync(lockFilePath)) {
          await fs.remove(lockFilePath)
        }
      }

      // Run install.
      await execa(packageManager, ["install"], {
        cwd: projectPath,
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

      createSpinner?.succeed("Creating a new Vite project.")
    } catch (error) {
      createSpinner?.fail("Something went wrong creating a new Vite project.")
      handleError(error)
    }
  },
  create: async () => {
    // Empty for now.
  },
  files: [
    {
      type: "registry:file",
      path: "src/App.tsx",
      target: "src/App.tsx",
      content: dedent`import { ComponentExample } from "@/components/component-example";

export function App() {
  return <ComponentExample />;
}

export default App;
`,
    },
  ],
})
