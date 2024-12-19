import { useAtom, useAtomValue } from "jotai"
import { atomWithStorage, selectAtom } from "jotai/utils"

import { BaseColor } from "@/registry/registry-base-colors"
import { Style } from "@/registry/registry-styles"
import { useMemo } from "react"

type Config = {
  style: Style["name"]
  theme: BaseColor["name"]
  radius: number
  packageManager: "npm" | "yarn" | "pnpm" | "bun"
}

const configAtom = atomWithStorage<Config>("config", {
  style: "new-york",
  theme: "zinc",
  radius: 0.5,
  packageManager: "pnpm",
})

export function useConfig() {
  return useAtom(configAtom)
}

export function useConfigValue<K extends keyof Config>(key: K) {
  const selectedAtom = useMemo(
    () => selectAtom(configAtom, (config) => config[key]),
    [key]
  )
  return useAtomValue(selectedAtom)
}
