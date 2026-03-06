import { CardsDemo } from "@/components/cards"
import { ThemeCustomizer } from "@/components/theme-customizer"

export const dynamic = "force-static"
export const revalidate = false

export default function ThemesPage() {
  return (
    <>
      <div id="themes" className="container-wrapper scroll-mt-20">
        <div className="container flex items-center justify-between gap-8 px-6 py-4 md:px-8">
          <ThemeCustomizer />
        </div>
      </div>
      <div className="container-wrapper flex flex-1 flex-col section-soft pb-6">
        <div className="container flex flex-1 flex-col theme-container">
          <CardsDemo />
        </div>
      </div>
    </>
  )
}
