"use client"

import * as React from "react"

import { Button } from "@/styles/radix-nova/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/styles/radix-nova/ui/drawer"
import { Input } from "@/styles/radix-nova/ui/input"
import { Label } from "@/styles/radix-nova/ui/label"

export function DrawerNonModal() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="outside-input">Outside input (focusable while drawer is open)</Label>
        <Input
          id="outside-input"
          placeholder="Click here while the drawer is open..."
        />
      </div>
      <Drawer open={open} onOpenChange={setOpen} modal={false}>
        <DrawerTrigger asChild>
          <Button variant="outline">Open Non-modal Drawer</Button>
        </DrawerTrigger>
        <DrawerContent showOverlay={false}>
          <DrawerHeader>
            <DrawerTitle>Non-modal Drawer</DrawerTitle>
            <DrawerDescription>
              You can still interact with content outside this drawer.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-2 p-4">
            <Label htmlFor="inside-input">Inside input</Label>
            <Input id="inside-input" placeholder="Type here..." />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
