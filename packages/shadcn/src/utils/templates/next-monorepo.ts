import os from "os"
import path from "path"
import { handleError } from "@/src/utils/handle-error"
import { spinner } from "@/src/utils/spinner"
import dedent from "dedent"
import { execa } from "execa"
import fs from "fs-extra"

import { GITHUB_TEMPLATE_URL, createTemplate } from "./create-template"

export const nextMonorepo = createTemplate({
  name: "next-monorepo",
  title: "Next.js (Monorepo)",
  defaultProjectName: "my-monorepo",
  init: async ({ projectPath, packageManager }) => {
    const createSpinner = spinner(
      `Creating a new Next.js monorepo. This may take a few minutes.`
    ).start()

    try {
      const localTemplateDir = process.env.SHADCN_TEMPLATE_DIR
      if (localTemplateDir) {
        // Use local template directory for development.
        const localTemplatePath = path.resolve(
          localTemplateDir,
          "monorepo-next"
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
          "ui-main/templates/monorepo-next",
        ])
        const extractedPath = path.resolve(templatePath, "monorepo-next")
        await fs.move(extractedPath, projectPath)
        await fs.remove(templatePath)
      }

      // Run install. Disable frozen lockfile since the template's lockfile may not match.
      await execa(packageManager, ["install"], {
        cwd: projectPath,
        env: {
          ...process.env,
          CI: "",
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

      // Try git init.
      const cwd = process.cwd()
      await execa("git", ["--version"], { cwd: projectPath })
      await execa("git", ["init"], { cwd: projectPath })
      await execa("git", ["add", "-A"], { cwd: projectPath })
      await execa("git", ["commit", "-m", "Initial commit"], {
        cwd: projectPath,
      })

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
