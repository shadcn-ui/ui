"use client"

import {
  Example,
  ExampleWrapper,
} from "@/registry/ark-mira/components/example"
import { Button } from "@/registry/ark-mira/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/ark-mira/ui/drawer"

export default function DrawerExample() {
  return (
    <ExampleWrapper>
      <DrawerScrollableContent />
      <DrawerWithSides />
    </ExampleWrapper>
  )
}

const DRAWER_SIDES = [
  { label: "top", swipeDirection: "up" },
  { label: "right", swipeDirection: "right" },
  { label: "bottom", swipeDirection: "down" },
  { label: "left", swipeDirection: "left" },
] as const

function DrawerWithSides() {
  return (
    <Example title="Sides">
      <div className="flex flex-wrap gap-2">
        {DRAWER_SIDES.map((side) => (
          <Drawer
            key={side.label}
            swipeDirection={
              side.swipeDirection === "down"
                ? undefined
                : side.swipeDirection
            }
          >
            <DrawerTrigger asChild>
              <Button variant="outline" className="capitalize">
                {side.label}
              </Button>
            </DrawerTrigger>
            <DrawerContent className="data-[swipe-direction=down]:max-h-[50vh] data-[swipe-direction=up]:max-h-[50vh]">
              <DrawerHeader>
                <DrawerTitle>Move Goal</DrawerTitle>
                <DrawerDescription>
                  Set your daily activity goal.
                </DrawerDescription>
              </DrawerHeader>
              <div className="no-scrollbar overflow-y-auto px-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <p
                    key={index}
                    className="mb-4 leading-normal style-lyra:mb-2 style-lyra:leading-relaxed"
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                ))}
              </div>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ))}
      </div>
    </Example>
  )
}

function DrawerScrollableContent() {
  return (
    <Example title="Scrollable Content">
      <Drawer swipeDirection="right">
        <DrawerTrigger asChild>
          <Button variant="outline">Scrollable Content</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="no-scrollbar overflow-y-auto px-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <p
                key={index}
                className="mb-4 leading-normal style-lyra:mb-2 style-lyra:leading-relaxed"
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            ))}
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Example>
  )
}
