import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

const configAtom = atomWithStorage<string[]>("chunk-mode", [])

export function useChunkMode() {
  const [chunkMode, setChunkMode] = useAtom(configAtom)

  function toggleChunkMode(name: string) {
    setChunkMode((prev) => {
      console.log({ prev })
      return prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name]
    })
  }

  return {
    chunkMode,
    toggleChunkMode,
  }
}
