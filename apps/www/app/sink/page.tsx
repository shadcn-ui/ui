"use client"

import * as React from "react"
import Link from "next/link"
import { ChromePicker, ColorResult } from "react-color"

import { cn } from "@/lib/utils"
import { AccordionDemo } from "@/components/examples/accordion/demo"
import { AlertDialogDemo } from "@/components/examples/alert-dialog/demo"
import { AspectRatioDemo } from "@/components/examples/aspect-ratio/demo"
import { AvatarDemo } from "@/components/examples/avatar/demo"
import { BadgeDemo } from "@/components/examples/badge/demo"
import { BadgeDestructive } from "@/components/examples/badge/destructive"
import { BadgeOutline } from "@/components/examples/badge/outline"
import { BadgeSecondary } from "@/components/examples/badge/secondary"
import { ButtonDemo } from "@/components/examples/button/demo"
import { ButtonDestructive } from "@/components/examples/button/destructive"
import { ButtonGhost } from "@/components/examples/button/ghost"
import { ButtonLink } from "@/components/examples/button/link"
import { ButtonLoading } from "@/components/examples/button/loading"
import { ButtonOutline } from "@/components/examples/button/outline"
import { ButtonSecondary } from "@/components/examples/button/secondary"
import { ButtonWithIcon } from "@/components/examples/button/with-icon"
import { CalendarDatePicker } from "@/components/examples/calendar/date-picker"
import { CardDemo } from "@/components/examples/card/demo"
import { CheckboxDemo } from "@/components/examples/checkbox/demo"
import { CollapsibleDemo } from "@/components/examples/collapsible/demo"
import { CommandDemo } from "@/components/examples/command/demo"
import { ContextMenuDemo } from "@/components/examples/context-menu/demo"
import { DialogDemo } from "@/components/examples/dialog/demo"
import { DropdownMenuDemo } from "@/components/examples/dropdown-menu/demo"
import { HoverCardDemo } from "@/components/examples/hover-card/demo"
import { MenubarDemo } from "@/components/examples/menubar/demo"
import { NavigationMenuDemo } from "@/components/examples/navigation-menu/demo"
import { PopoverDemo } from "@/components/examples/popover/demo"
import { ProgressDemo } from "@/components/examples/progress/demo"
import { RadioGroupDemo } from "@/components/examples/radio-group/demo"
import { ScrollAreaDemo } from "@/components/examples/scroll-area/demo"
import { SelectDemo } from "@/components/examples/select/demo"
import { SeparatorDemo } from "@/components/examples/separator/demo"
import { SheetDemo } from "@/components/examples/sheet/demo"
import { SkeletonDemo } from "@/components/examples/skeleton/demo"
import { SliderDemo } from "@/components/examples/slider/demo"
import { SwitchDemo } from "@/components/examples/switch/demo"
import { TabsDemo } from "@/components/examples/tabs/demo"
import { ToastDemo } from "@/components/examples/toast/demo"
import { ToggleDemo } from "@/components/examples/toggle/demo"
import { ToggleDisabled } from "@/components/examples/toggle/disabled"
import { ToggleOutline } from "@/components/examples/toggle/outline"
import { ToggleWithText } from "@/components/examples/toggle/with-text"
import { TooltipDemo } from "@/components/examples/tooltip/demo"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const colors = [
  "300 0% 0%",
  "220 79% 48%",
  "106.41509433962264 65.43965588551576% 32.114428499999995%",
  "258.4049079754601 64.39459741483951% 50.063758%",
  "0 0% 100%",
]

// :root {
// --primary: ${selectedColor.hsl.h} ${selectedColor.hsl.s * 100}%
//   ${selectedColor.hsl.l * 100}%;
// }

export default function KitchenSinkPage() {
  const [selectedColor, setSelectedColor] = React.useState<ColorResult>({
    hex: "#000000",
    hsl: { h: 0, s: 0, l: 0, a: 1 },
    rgb: { r: 0, g: 0, b: 0, a: 1 },
  })

  return (
    <>
      <div className="font-ui grid gap-4 py-10">
        <div className="flex justify-end rounded-md border p-2">
          <div className="flex items-center space-x-2 rounded-md border p-2">
            <p className="text-sm font-medium leading-none">Primary</p>
            <Popover>
              <PopoverTrigger
                className="h-6 w-6 rounded-full"
                style={{
                  backgroundColor: selectedColor.hex,
                }}
              >
                <span className="sr-only">Toggle</span>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <ChromePicker
                  className="shadow-none"
                  styles={{
                    default: {
                      picker: {
                        boxShadow: "none",
                        border: "none",
                      },
                      saturation: {
                        borderRadius: "0.375rem",
                        overflow: "hidden",
                        border: "1px solid #fff",
                      },
                    },
                  }}
                  color={selectedColor.hex}
                  onChange={(color) => {
                    setSelectedColor(color)
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="grid grid-cols-3 items-start gap-4">
          <div className="grid gap-4">
            <ComponentWrapper>
              <CardDemo className="w-full" />
            </ComponentWrapper>
            <ComponentWrapper>
              <SliderDemo className="w-full" />
            </ComponentWrapper>
            <ComponentWrapper
              className="spa flex-col items-start space-y-2
				space-x-0"
            >
              <p className="text-foreground-muted text-sm">Documentation</p>
              <p className="text-sm font-medium leading-none">
                You can customize the theme using{" "}
                <code className="bg-muted text-foreground relative rounded py-[0.2rem] px-[0.3rem] font-mono text-sm font-semibold">
                  CSS variables
                </code>
                .{" "}
                <Link
                  href="#"
                  className="text-primary font-medium underline underline-offset-4"
                >
                  Click here
                </Link>{" "}
                to learn more.
              </p>
            </ComponentWrapper>
            <ComponentWrapper>
              <CheckboxDemo />
              <HoverCardDemo />
            </ComponentWrapper>
            <ComponentWrapper className="[&>div]:w-full">
              <TabsDemo />
            </ComponentWrapper>
          </div>
          <div className="grid gap-4">
            <ComponentWrapper>
              <MenubarDemo />
              <AvatarDemo />
            </ComponentWrapper>
            <ComponentWrapper className="flex-col items-start space-y-2 space-x-0">
              <div className="flex space-x-2">
                <ButtonDemo />
                <ButtonSecondary />
                <ButtonDestructive />
              </div>
              <div className="flex space-x-2">
                <ButtonOutline />
                <ButtonLink />
                <ButtonGhost />
              </div>
              <div className="flex space-x-2">
                <ButtonWithIcon />
                <ButtonLoading />
              </div>
            </ComponentWrapper>
            <ComponentWrapper>
              <CalendarDatePicker />
            </ComponentWrapper>
            <ComponentWrapper>
              <AccordionDemo />
            </ComponentWrapper>
            <ComponentWrapper className="[&_ul>li:last-child]:hidden">
              <NavigationMenuDemo />
            </ComponentWrapper>
            <ComponentWrapper className="justify-between">
              <SwitchDemo />
              <SelectDemo />
            </ComponentWrapper>
            <ComponentWrapper>
              <SeparatorDemo />
            </ComponentWrapper>
            <ComponentWrapper>
              <AspectRatioDemo />
            </ComponentWrapper>
            <ComponentWrapper>
              <PopoverDemo />
              <ToastDemo />
            </ComponentWrapper>
          </div>
          <div className="grid gap-4">
            <ComponentWrapper>
              <TooltipDemo />
              <SheetDemo />
              <ProgressDemo />
            </ComponentWrapper>
            <ComponentWrapper>
              <CommandDemo />
            </ComponentWrapper>
            <ComponentWrapper className="[&>span]:h-[80px] [&>span]:w-[200px]">
              <RadioGroupDemo />
              <ContextMenuDemo />
            </ComponentWrapper>
            <ComponentWrapper>
              <div className="flex space-x-2">
                <DropdownMenuDemo />
                <AlertDialogDemo />
                <DialogDemo />
              </div>
            </ComponentWrapper>
            <ComponentWrapper>
              <div className="flex space-x-2">
                <BadgeDemo />
                <BadgeSecondary />
                <BadgeDestructive />
                <BadgeOutline />
              </div>
            </ComponentWrapper>
            <ComponentWrapper>
              <SkeletonDemo />
            </ComponentWrapper>
            <ComponentWrapper className="[&>div]:w-full">
              <CollapsibleDemo />
            </ComponentWrapper>
            <ComponentWrapper>
              <div className="flex space-x-2">
                <ToggleDemo />
                <ToggleOutline />
                <ToggleDisabled />
                <ToggleWithText />
              </div>
            </ComponentWrapper>
            <ComponentWrapper>
              <ScrollAreaDemo />
            </ComponentWrapper>
          </div>
        </div>
      </div>
    </>
  )
}

function ComponentWrapper({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between space-x-4 rounded-md border p-4",
        className
      )}
    >
      {children}
    </div>
  )
}
