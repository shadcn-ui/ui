"use client"

import { Button } from "@/styles/ark-nova/ui/button"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/styles/ark-nova/ui/drawer"

const SNAP_POINTS = ["31rem", 1]

export function DrawerSnapPoints() {
  return (
    <Drawer snapPoints={SNAP_POINTS}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Snap Drawer</Button>
      </DrawerTrigger>
      <DrawerContent showHandle>
        <DrawerHeader>
          <DrawerTitle>Snap points</DrawerTitle>
          <DrawerDescription>
            Drag the drawer to snap between a compact peek and a near
            full-height view.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="p-4">
          <div className="rounded-2xl bg-muted group-data-[swipe-direction=down]/drawer-content:h-80 group-data-[swipe-direction=down]/drawer-content:w-full group-data-[swipe-direction=up]/drawer-content:h-80 group-data-[swipe-direction=up]/drawer-content:w-full" />
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
