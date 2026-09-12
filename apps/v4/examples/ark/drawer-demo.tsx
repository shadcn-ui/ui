"use client"

import * as React from "react"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/styles/ark-nova/ui/badge"
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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldTitle,
} from "@/styles/ark-nova/ui/field"
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
} from "@/styles/ark-nova/ui/radio-group"
import { toast } from "@/styles/ark-nova/ui/toast"

const deliveryTimes = [
  {
    value: "asap",
    label: "Standard delivery",
    description: "25–35 min · Driver assigned now",
    badge: "Fastest",
  },
  {
    value: "5-00",
    label: "5:00 PM – 5:15 PM",
    description: "Prep starts at 4:45 PM",
  },
  {
    value: "5-30",
    label: "5:30 PM – 5:45 PM",
    description: "Good if you're heading home",
  },
  {
    value: "6-00",
    label: "6:00 PM – 6:15 PM",
    description: "Most popular · High demand",
  },
  {
    value: "6-30",
    label: "6:30 PM – 6:45 PM",
    description: "Last slot before kitchen closes",
  },
]

export function DrawerDemo() {
  const [open, setOpen] = React.useState(false)
  const [deliveryTime, setDeliveryTime] = React.useState("asap")
  const isMobile = useIsMobile()

  function handleConfirm() {
    const selected = deliveryTimes.find((time) => time.value === deliveryTime)

    if (!selected) {
      return
    }

    setOpen(false)
    toast.create({
      title: "Delivery time confirmed",
      description: selected.label,
    })
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerTrigger asChild>
        <Button variant="secondary">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent showHandle={isMobile}>
        <DrawerHeader>
          <DrawerTitle>Pick a delivery time</DrawerTitle>
          <DrawerDescription>
            We&apos;ll prepare your order as soon as possible.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="scroll-fade p-4">
          <RadioGroup
            value={deliveryTime}
            onValueChange={(details) =>
              setDeliveryTime(details.value ?? deliveryTime)
            }
            className="gap-2"
          >
            {deliveryTimes.map((time) => (
              <RadioGroupItem
                key={time.value}
                value={time.value}
                className="w-full"
              >
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle className="flex items-center gap-2">
                      {time.label}
                      {time.badge ? (
                        <Badge variant="secondary">{time.badge}</Badge>
                      ) : null}
                    </FieldTitle>
                    <FieldDescription>{time.description}</FieldDescription>
                  </FieldContent>
                  <RadioGroupItemControl />
                </Field>
                <RadioGroupItemHiddenInput />
              </RadioGroupItem>
            ))}
          </RadioGroup>
        </DrawerBody>
        <DrawerFooter>
          <Button onClick={handleConfirm} className="h-[34px]">
            Confirm Delivery Time
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
