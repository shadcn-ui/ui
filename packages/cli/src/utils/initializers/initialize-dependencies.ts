import { Config } from "@/src/utils/get-config"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { execa } from "execa"

const PROJECT_DEPENDENCIES = [
  "tailwindcss-animate",
  "class-variance-authority",
  "clsx",
  "tailwind-merge",
]

export async function initializeDependencies(config: Config) {
  const packageManager = await getPackageManager(config.resolvedPaths.cwd)

  const dependencies = [
    ...PROJECT_DEPENDENCIES,
    // TODO: add support for other icon libraries.
    // TODO: remove this when we migrate new-york to lucide-react.
    config.style === "new-york" ? "@radix-ui/react-icons" : "lucide-react",
  ]

  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", ...dependencies],
    {
      cwd: config.resolvedPaths.cwd,
    }
  )
}
