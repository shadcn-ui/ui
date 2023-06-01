import { Style } from "@/registry/styles"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

type Config = {
  style: Style["name"]
}

const configAtom = atomWithStorage<Config>("config", {
  style: "default",
})

export function useConfig() {
  return useAtom(configAtom)
}
