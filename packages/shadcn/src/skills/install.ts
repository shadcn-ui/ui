import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { execa } from "execa"
import prompts from "prompts"

export async function installShadcnSkills({
  cwd,
  silent,
}: {
  cwd: string
  silent?: boolean
}) {
  try {
    await execa("npx", ["skills", "add", "shadcn/ui"], {
      cwd,
      stdio: "inherit",
    })
  } catch (error) {
    if (!silent) {
      logger.warn(
        `Failed to install shadcn agent skills. You can install them later with: ${highlighter.info(
          "npx skills add shadcn/ui"
        )}`
      )
    }
  }
}

export async function promptInstallShadcnSkills({
  cwd,
  silent,
}: {
  cwd: string
  silent?: boolean
}) {
  if (silent) return

  const { installSkills } = await prompts({
    type: "confirm",
    name: "installSkills",
    message: `Install ${highlighter.info(
      "shadcn/ui skills"
    )} for AI coding agents?`,
    initial: true,
  })

  if (installSkills) {
    await installShadcnSkills({ cwd, silent })
  }
}
