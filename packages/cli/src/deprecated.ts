import chalk from "chalk"

export const DEPRECATED_MESSAGE = chalk.yellow(
  `\nNote: The shadcn-ui CLI is going to be deprecated soon. Please use ${chalk.bold(
    "npx shadcn"
  )} instead.\n`
)
