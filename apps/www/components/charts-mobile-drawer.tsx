"use client"

import * as React from "react"

import { ChartsNav } from "@/components/charts-nav"
import { ChartsThemeSwitcher } from "@/components/charts-theme-switcher"
import { Drawer, DrawerContent } from "@/registry/new-york/ui/drawer"

export function ChartsMobileDrawer() {
  const [snap, setSnap] = React.useState<number | string | null>("120px")

  return (
    <>
      <style>{`
      [vaul-drawer-wrapper] {
        transform: none !important;
        border-radius: 0 !important;
      }
    `}</style>
      <Drawer
        open={true}
        modal={false}
        dismissible={false}
        snapPoints={["120px", "320px"]}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
      >
        <DrawerContent className="h-full max-h-[97%] rounded-2xl outline-none [&>.bg-muted]:mt-3 [&>.bg-muted]:h-1.5">
          <ChartsThemeSwitcher />
          <ChartsNav />
        </DrawerContent>
      </Drawer>
    </>
  )
}
