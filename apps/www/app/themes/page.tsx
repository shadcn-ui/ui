import { Metadata } from "next"

import { ThemeComponent } from "@/components/theme-component"

import "public/registry/themes.css"
import { ThemeToolbar } from "@/components/theme-toolbar"
import { ThemesTabs } from "@/app/themes/tabs"

export const metadata: Metadata = {
  title: "Themes",
  description: "Customize the look and feel of your components.",
}

export default function ThemesPage() {
  return (
    <div className="container space-y-8 py-8">
      <ThemesTabs />
    </div>
  )
}
