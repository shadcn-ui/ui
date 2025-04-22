import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import { Style } from "@/registry/registry-styles"

type Config = {
  style: Style["name"] | "new-york-v4"
  packageManager: "npm" | "yarn" | "pnpm" | "bun"
  installationType: "cli" | "manual"
}

const configAtom = atomWithStorage<Config>("config", {
  style: "new-york",
  packageManager: "pnpm",
  installationType: "cli",
})

export function useConfig() {
  return useAtom(configAtom)
}
