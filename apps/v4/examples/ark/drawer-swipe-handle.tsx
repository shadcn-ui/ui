"use client"

import { Button } from "@/styles/ark-nova/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/styles/ark-nova/ui/drawer"

export function DrawerSwipeHandle() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent showHandle>
        <DrawerHeader>
          <DrawerTitle>Drawer</DrawerTitle>
          <DrawerDescription>Drawer with a swipe handle.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 p-4">
          <div className="rounded-2xl bg-muted group-data-[swipe-direction=down]/drawer-content:h-80 group-data-[swipe-direction=down]/drawer-content:w-full group-data-[swipe-direction=left]/drawer-content:size-full group-data-[swipe-direction=right]/drawer-content:size-full group-data-[swipe-direction=up]/drawer-content:h-80 group-data-[swipe-direction=up]/drawer-content:w-full" />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
