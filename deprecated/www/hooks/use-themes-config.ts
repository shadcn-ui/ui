import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import { THEMES, Theme } from "@/lib/themes"

type ThemesConfig = {
  activeTheme: Theme
}

const configAtom = atomWithStorage<ThemesConfig>("themes:config2", {
  activeTheme: THEMES[0],
})

export function useThemesConfig() {
  const [themesConfig, setThemesConfig] = useAtom(configAtom)

  return { themesConfig, setThemesConfig }
}
