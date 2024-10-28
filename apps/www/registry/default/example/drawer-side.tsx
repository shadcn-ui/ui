import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/default/ui/drawer"

export default function DrawerSideDemo() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-[300px] max-w-sm">
          <DrawerHeader>
            <DrawerTitle>It supports all directions.</DrawerTitle>
            <DrawerDescription>
              It's also draggable and supports velocity-based swiping.
            </DrawerDescription>
          </DrawerHeader>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
