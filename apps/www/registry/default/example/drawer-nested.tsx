import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerNested,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/default/ui/drawer"

export default function DrawerNestedDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open First Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="text-left">
            <DrawerTitle>First drawer</DrawerTitle>
            <DrawerDescription>
              Open a nested drawer on top of this one.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-2">
            <DrawerNested>
              <DrawerTrigger asChild>
                <Button variant="default">Open Nested Drawer</Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader className="text-left">
                    <DrawerTitle>Second drawer</DrawerTitle>
                    <DrawerDescription>
                      Place a <InlineCode>DrawerNested</InlineCode> inside
                      another <InlineCode>Drawer</InlineCode> and it will be
                      nested automatically for you.
                    </DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                      <Button variant="outline">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </DrawerNested>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function InlineCode({ children }: React.ComponentProps<"code">) {
  return (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
      {children}
    </code>
  )
}
