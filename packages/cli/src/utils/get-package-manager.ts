export function getPackageManager() {
  const userAgent = process.env.npm_config_user_agent

  if (!userAgent) {
    return "npm"
  }

  if (userAgent.startsWith("yarn")) {
    return "yarn"
  }

  if (userAgent.startsWith("pnpm")) {
    return "pnpm"
  }

  return "npm"
}
