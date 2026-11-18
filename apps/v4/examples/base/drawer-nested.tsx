"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/styles/base-rhea/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/styles/base-rhea/ui/drawer"

export function DrawerNested() {
  const isMobile = useIsMobile()

  const swipeDirection = isMobile ? "down" : "right"

  return (
    <Drawer showSwipeHandle={isMobile} swipeDirection={swipeDirection}>
      <DrawerTrigger render={<Button variant="secondary" />}>
        Open Drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer</DrawerTitle>
          <DrawerDescription>
            Open another drawer from the same direction.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 p-4">
          <div className="bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:aspect-video group-data-[swipe-axis=y]/drawer-popup:w-full" />
        </div>
        <DrawerFooter>
          <Drawer showSwipeHandle={isMobile} swipeDirection={swipeDirection}>
            <DrawerTrigger render={<Button variant="outline" />}>
              Open Nested Drawer
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Nested Drawer</DrawerTitle>
                <DrawerDescription>
                  The parent drawer stays mounted behind this one.
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex-1 p-4">
                <div className="bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:aspect-video group-data-[swipe-axis=y]/drawer-popup:w-full" />
              </div>
              <DrawerFooter>
                <Drawer
                  showSwipeHandle={isMobile}
                  swipeDirection={swipeDirection}
                >
                  <DrawerTrigger render={<Button variant="outline" />}>
                    Open Third Drawer
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Third Drawer</DrawerTitle>
                      <DrawerDescription>
                        Two drawers are stacked behind this one.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex-1 p-4">
                      <div className="bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:aspect-video group-data-[swipe-axis=y]/drawer-popup:w-full" />
                    </div>
                    <DrawerFooter>
                      <Drawer
                        showSwipeHandle={isMobile}
                        swipeDirection={swipeDirection}
                      >
                        <DrawerTrigger render={<Button variant="outline" />}>
                          Open Fourth Drawer
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Fourth Drawer</DrawerTitle>
                            <DrawerDescription>
                              This is the frontmost drawer in the stack.
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="flex-1 p-4">
                            <div className="bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:aspect-video group-data-[swipe-axis=y]/drawer-popup:w-full" />
                          </div>
                          <DrawerFooter>
                            <DrawerClose render={<Button variant="outline" />}>
                              Close
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                      <DrawerClose render={<Button variant="outline" />}>
                        Close
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
                <DrawerClose render={<Button variant="outline" />}>
                  Close
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
