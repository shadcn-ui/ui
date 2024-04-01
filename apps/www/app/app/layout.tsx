import "@/styles/globals.css"
import { Suspense } from "react"
import { Metadata, Viewport } from "next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"

import { Sidebar } from "../examples/music/components/sidebar"
import { playlists } from "../examples/music/data/playlists"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <div className="grid grid-cols-10">
        <Sidebar playlists={playlists} className="grid-cols-1"></Sidebar>
        <main className="col-span-9 border-l">{children}</main>
      </div>
    </>
  )
}
