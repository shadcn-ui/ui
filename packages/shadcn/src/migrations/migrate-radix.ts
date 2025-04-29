import fs from "fs"
import path from "path"
import { Config } from "@/src/utils/get-config"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { spinner } from "@/src/utils/spinner"
import { execa } from "execa"
import fg from "fast-glob"

export async function migrateRadix(config: Config) {
  if (!config.resolvedPaths.ui) {
    throw new Error(
      "We could not find a valid `ui` path in your `components.json` file. Please ensure you have a valid `ui` path in your `components.json` file."
    )
  }

  const uiPath = config.resolvedPaths.ui
  const [files] = await Promise.all([
    fg("**/*.{js,ts,jsx,tsx}", {
      cwd: uiPath,
    }),
  ])

  const migrationSpinner = spinner(`Migrating to radix-ui...`)?.start()

  migrationSpinner.text = "Replacing imports in files."

  const unusedPackages = new Set<string>()

  for (const filepath of files) {
    const absoluteFilepath = path.resolve(uiPath, filepath)
    const fileContent = await fs.promises.readFile(absoluteFilepath, "utf-8")
    const transformedContent = fileContent
      .replace(
        /import \* as (\w+Primitive) from "@radix-ui\/react-([\w-]+)"/g,
        (_, primitive, pkg) => {
          unusedPackages.add(`@radix-ui/react-${pkg}`)
          return `import { ${primitive.replace(
            "Primitive",
            ""
          )} as ${primitive} } from "radix-ui"`
        }
      )
      // special case for `Sheet`
      .replace(/Sheet\s+as\s+SheetPrimitive/g, "Dialog as SheetPrimitive")
      // special cases for `Slot` including type, ternary and JSX
      .replace(
        /import\s+\{\s+Slot\s+\}\s+from\s+"@radix-ui\/react-slot"/,
        () => {
          unusedPackages.add("@radix-ui/react-slot")
          return "import { Slot as SlotPrimitive } from 'radix-ui'"
        }
      )
      .replace(/typeof\s+Slot/g, "typeof SlotPrimitive.Slot")
      .replace(/\?\s+Slot\s+:/g, "? SlotPrimitive.Slot :")
      .replace(/<Slot/g, "<SlotPrimitive.Slot")
    await fs.promises.writeFile(absoluteFilepath, transformedContent, "utf-8")
  }

  migrationSpinner.text = "Removing unused @radix-ui/* packages."

  const packageManager = await getPackageManager(config.resolvedPaths.cwd)

  if (unusedPackages.size) {
    await execa(
      packageManager,
      [
        packageManager === "npm" ? "uninstall" : "remove",
        ...Array.from(unusedPackages),
      ],
      {
        cwd: config.resolvedPaths.cwd,
      }
    )
  }

  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", "radix-ui"],
    {
      cwd: config.resolvedPaths.cwd,
    }
  )

  migrationSpinner.succeed("Migration complete.")
}
