export function replacePmCommand(npmCommand: string): string {
  const userPreference = localStorage.getItem("shadcn-ui_last-used-pm")
  if (userPreference === "npm" || userPreference === null) return npmCommand

  if (userPreference === "yarn") {
    return npmCommand
      .replace("npm install", "yarn add")
      .replace("npx create-", "yarn create ")
      .replace("npx", "yarn")
  }

  if (userPreference === "pnpm") {
    return npmCommand
      .replace("npm install", "pnpm add")
      .replace("npx create-", "pnpm create ")
      .replace("npx", "pnpm dlx")
  }

  if (userPreference === "bun") {
    return npmCommand
      .replace("npm install", "bun add")
      .replace("npx create-", "bun create ")
      .replace("npx", "bunx --bun")
  }
  return npmCommand
}
