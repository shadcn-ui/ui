import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import { BaseColor } from "@/registry/registry-base-colors"
import { Style } from "@/registry/registry-styles"

type Config = {
  style: Style["name"]
  theme: BaseColor["name"]
  radius: number
}

const configAtom = atomWithStorage<Config>("config", {
  style: "default",
  theme: "zinc",
  radius: 0.5,
})

export function useConfig() {
  return useAtom(configAtom)
}
