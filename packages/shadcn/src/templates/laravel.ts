import { highlighter } from "@shadcn/registry/internal/highlighter"
import { logger } from "@shadcn/registry/internal/logger"
import { SHADCN_URL } from "@shadcn/registry/internal/registry/constants"

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
