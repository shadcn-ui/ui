import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

type ConfigPackageManager = "npm" | "yarn" | "pnpm" | "bun"

const configAtom = atomWithStorage<ConfigPackageManager>(
  "config-package-manager",
  "pnpm"
)

export function useConfigPackageManager() {
  return useAtom(configAtom)
}
