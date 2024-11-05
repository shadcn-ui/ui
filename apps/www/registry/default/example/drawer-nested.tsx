import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerNested,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/default/ui/drawer"

export default function DrawerSideDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Nested drawer.</DrawerTitle>
            <DrawerDescription>
			Click on the button to open a second drawer.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <DrawerNested>
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-full">
                  Open Drawer
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>This drawer is nested</DrawerTitle>
                    <DrawerDescription>
                      You can nest as many drawers as you want.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4">
                    <DrawerClose asChild>
                      <Button variant="outline" className="w-full">
                        Close nested drawer
                      </Button>
                    </DrawerClose>
                  </div>
                </div>
              </DrawerContent>
            </DrawerNested>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
