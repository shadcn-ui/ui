import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import { ColorFormat } from "@/lib/colors"
import { useMounted } from "@/hooks/use-mounted"

type Config = {
  format: ColorFormat
  lastCopied: string
}

const colorsAtom = atomWithStorage<Config>("colors", {
  format: "hsl",
  lastCopied: "",
})

export function useColors() {
  const [colors, setColors] = useAtom(colorsAtom)
  const mounted = useMounted()

  return {
    isLoading: !mounted,
    format: colors.format,
    lastCopied: colors.lastCopied,
    setFormat: (format: ColorFormat) => setColors({ ...colors, format }),
    setLastCopied: (lastCopied: string) => setColors({ ...colors, lastCopied }),
  }
}
