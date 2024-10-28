import * as React from "react"

import { Button } from "@/registry/new-york/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerNested,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/new-york/ui/drawer"

export default function DrawerDemo() {
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
      <DrawerNested>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>This drawer is nested</DrawerTitle>
            <DrawerDescription>
              It's also draggable and supports velocity-based swiping.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerClose>Close nested drawer</DrawerClose>
        </DrawerContent>
      </DrawerNested>
    </Drawer>
  )
}
