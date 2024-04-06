import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import { BackendProvider } from "@/registry/backend-provider"
import { Style } from "@/registry/styles"
import { Theme } from "@/registry/themes"

type Config = {
  style: Style["name"]
  theme: Theme["name"]
  radius: number
  backendProvider: BackendProvider["name"] | undefined
}

const configAtom = atomWithStorage<Config>("config", {
  style: "default",
  backendProvider: "nextjs-auth",
  theme: "zinc",
  radius: 0.5,
})

export function useConfig() {
  return useAtom(configAtom)
}
