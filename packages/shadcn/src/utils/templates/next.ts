import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import dedent from "dedent"
import { execa } from "execa"

import { createTemplate } from "./create-template"

export const next = createTemplate({
  name: "next",
  title: "Next.js",
  defaultProjectName: "my-app",
  init: async ({ projectPath, packageManager, cwd, srcDir, version }) => {
    const createSpinner = spinner(
      `Creating a new Next.js project. This may take a few minutes.`
    ).start()

    // Note: pnpm fails here. Fallback to npx with --use-PACKAGE-MANAGER.
    const args = [
      "--tailwind",
      "--eslint",
      "--typescript",
      "--app",
      srcDir ? "--src-dir" : "--no-src-dir",
      "--no-import-alias",
      `--use-${packageManager}`,
    ]

    if (
      version.startsWith("15") ||
      version.startsWith("latest") ||
      version.startsWith("canary")
    ) {
      args.push("--turbopack")
    }

    if (version.startsWith("latest") || version.startsWith("canary")) {
      args.push("--no-react-compiler")
    }

    try {
      await execa(
        "npx",
        [`create-next-app@${version}`, projectPath, "--silent", ...args],
        {
          cwd,
        }
      )
    } catch (error) {
      logger.break()
      logger.error(
        `Something went wrong creating a new Next.js project. Please try again.`
      )
      process.exit(1)
    }

    createSpinner?.succeed("Creating a new Next.js project.")
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
