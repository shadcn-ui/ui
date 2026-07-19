import packageJson from "../../package.json"
import { type ProjectInfo } from "./get-project-info"

let userAgent = `shadcn/${packageJson.version}`

export function getUserAgent() {
  if (process.env.NODE_ENV === "test" || process.env.VITEST) {
    return "shadcn"
  }
  return userAgent
}

export function setUserAgent(projectInfo: ProjectInfo | null) {
  if (!projectInfo) return

  const framework = projectInfo.framework.name || "unknown"
  const language = projectInfo.isTsx ? "typescript" : "javascript"
  const tailwind = projectInfo.tailwindVersion
    ? `tailwind-${projectInfo.tailwindVersion}`
    : "tailwind-v4"

  userAgent = `shadcn/${packageJson.version} (${framework}; ${language}; ${tailwind})`
}
