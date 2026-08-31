"use client"

import { useIsMobile } from "@/hooks/use-mobile"
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

const placeholder =
  "rounded-2xl bg-muted group-data-[swipe-direction=down]/drawer-content:aspect-video group-data-[swipe-direction=down]/drawer-content:w-full group-data-[swipe-direction=left]/drawer-content:size-full group-data-[swipe-direction=right]/drawer-content:size-full group-data-[swipe-direction=up]/drawer-content:aspect-video group-data-[swipe-direction=up]/drawer-content:w-full"

export function DrawerNested() {
  const isMobile = useIsMobile()

  const swipeDirection = isMobile ? "down" : "right"

  return (
    <Drawer swipeDirection={swipeDirection}>
      <DrawerTrigger asChild>
        <Button variant="secondary">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent showHandle={isMobile}>
        <DrawerHeader>
          <DrawerTitle>Drawer</DrawerTitle>
          <DrawerDescription>
            Open another drawer from the same direction.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 p-4">
          <div className={placeholder} />
        </div>
        <DrawerFooter>
          <Drawer swipeDirection={swipeDirection}>
            <DrawerTrigger asChild>
              <Button variant="outline">Open Nested Drawer</Button>
            </DrawerTrigger>
            <DrawerContent showHandle={isMobile}>
              <DrawerHeader>
                <DrawerTitle>Nested Drawer</DrawerTitle>
                <DrawerDescription>
                  The parent drawer stays mounted behind this one.
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex-1 p-4">
                <div className={placeholder} />
              </div>
              <DrawerFooter>
                <Drawer swipeDirection={swipeDirection}>
                  <DrawerTrigger asChild>
                    <Button variant="outline">Open Third Drawer</Button>
                  </DrawerTrigger>
                  <DrawerContent showHandle={isMobile}>
                    <DrawerHeader>
                      <DrawerTitle>Third Drawer</DrawerTitle>
                      <DrawerDescription>
                        Two drawers are stacked behind this one.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex-1 p-4">
                      <div className={placeholder} />
                    </div>
                    <DrawerFooter>
                      <Drawer swipeDirection={swipeDirection}>
                        <DrawerTrigger asChild>
                          <Button variant="outline">Open Fourth Drawer</Button>
                        </DrawerTrigger>
                        <DrawerContent showHandle={isMobile}>
                          <DrawerHeader>
                            <DrawerTitle>Fourth Drawer</DrawerTitle>
                            <DrawerDescription>
                              This is the frontmost drawer in the stack.
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="flex-1 p-4">
                            <div className={placeholder} />
                          </div>
                          <DrawerFooter>
                            <DrawerClose asChild>
                              <Button variant="outline">Close</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
