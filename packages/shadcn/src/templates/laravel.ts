import { SHADCN_URL } from "@shadcn/registry/internal/registry/constants"
import { highlighter } from "@shadcn/registry/internal/utils/highlighter"
import { logger } from "@shadcn/registry/internal/utils/logger"

import { createTemplate } from "./create-template"

export const laravel = createTemplate({
  name: "laravel",
  title: "Laravel",
  description: "Requires `laravel new`",
  defaultProjectName: "laravel-app",
  templateDir: "laravel-app",
  frameworks: ["laravel"],
  scaffold: async () => {
    logger.break()
    logger.log(
      `  Please create a new app with ${highlighter.info(
        "laravel new --react"
      )} first then run ${highlighter.info("shadcn init")}.`
    )
    logger.log(
      `  See ${highlighter.info(
        `${SHADCN_URL}/docs/installation/laravel`
      )} for more information.`
    )
    logger.break()
    process.exit(0)
  },
  create: async () => {
    // Not used — scaffold exits early.
  },
})
