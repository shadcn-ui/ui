import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

type Config = {
  style: "new-york-v4"
  packageManager: "npm" | "yarn" | "pnpm" | "bun"
  installationType: "cli" | "manual"
  currentBase: "radix" | "base"
}

const configAtom = atomWithStorage<Config>("config", {
  style: "new-york-v4",
  packageManager: "pnpm",
  installationType: "cli",
  currentBase: "radix"
})

export function useConfig() {
  return useAtom(configAtom)
}
