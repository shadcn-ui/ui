import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import { Style } from "@/registry/styles"
import { Theme } from "@/registry/themes"

type Config = {
  style: Style["name"]
  theme: Theme["name"]
}

const configAtom = atomWithStorage<Config>("config", {
  style: "default",
  theme: "zinc",
})

export function useConfig() {
  return useAtom(configAtom)
}
