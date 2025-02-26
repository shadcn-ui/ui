#!/usr/bin/env node
import chalk from "chalk"

function getInvoker() {
  const args = process.argv.slice(2)
  const env = process.env
  const npmExecPath = env.npm_execpath || ""

  // Try to extract version specifier from the command
  let packageName = "shadcn"

  // Check if a version was specified in the original command
  // This could be extracted from npm_config_argv or similar env variables
  // For demonstration, let's check a few common patterns
  if (process.argv[1] && process.argv[1].includes("shadcn-ui@")) {
    const versionMatch = process.argv[1].match(/shadcn-ui(@[^/]+)/)
    if (versionMatch && versionMatch[1]) {
      packageName = `shadcn${versionMatch[1]}` // Add the version specifier
    }
  }

  if (npmExecPath.includes("pnpm")) {
    return `pnpm dlx ${packageName}${args.length ? ` ${args.join(" ")}` : ""}`
  } else if (npmExecPath.includes("yarn")) {
    return `yarn dlx ${packageName}${args.length ? ` ${args.join(" ")}` : ""}`
  } else if (npmExecPath.includes("bun")) {
    return `bunx ${packageName}${args.length ? ` ${args.join(" ")}` : ""}`
  } else {
    return `npx ${packageName}${args.length ? ` ${args.join(" ")}` : ""}`
  }
}

// Main function
const main = async () => {
  console.log(
    chalk.yellow(
      "The 'shadcn-ui' package is deprecated. Please use the 'shadcn' package instead:"
    )
  )
  console.log("")
  console.log(chalk.green(`  ${getInvoker()}`))
  console.log("")
  console.log(
    chalk.yellow("For more information, visit: https://ui.shadcn.com/docs/cli")
  )
  console.log("")
}

main().catch((error) => {
  console.error(chalk.red("Error:"), error.message)
  process.exit(1)
})
