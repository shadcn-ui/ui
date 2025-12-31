import { CardsDemo } from "@/components/cards"
import { ThemeWrapper } from "@/components/theme-wrapper"

import "public/registry/themes.css"

export default function ThemesPage() {
  return (
    <ThemeWrapper>
      <CardsDemo />
    </ThemeWrapper>
  )
}
