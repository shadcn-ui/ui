"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

const positions = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const
type Position = typeof positions[number]

const swipeDirections = ["up", "right", "left", "down"] as const
type SwipeDirection = typeof swipeDirections[number]

export const ToastAdvanced = () => {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<Position>("bottom-right")
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>("right")

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 md:flex-row">
        <div>
          <Label htmlFor="position">Position</Label>
          <Select
            defaultValue="bottom-right"
            onValueChange={(newPosition) =>
              setPosition(newPosition as Position)
            }
          >
            <SelectTrigger id="position" className="w-[180px]">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((pos) => (
                <SelectItem key={pos} value={pos}>
                  {pos}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="swipe-direction">Swipe Direction</Label>
          <Select
            defaultValue="right"
            onValueChange={(newSwipeDirection) =>
              setSwipeDirection(newSwipeDirection as SwipeDirection)
            }
          >
            <SelectTrigger id="swipe-direction" className="w-[180px]">
              <SelectValue placeholder="Swipe Direction" />
            </SelectTrigger>
            <SelectContent>
              {swipeDirections.map((direction) => (
                <SelectItem key={direction} value={direction}>
                  {direction}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Button
          onClick={() => {
            setOpen(true)
          }}
        >
          Show toast
        </Button>
        <ToastProvider swipeDirection={swipeDirection}>
          <Toast open={open} onOpenChange={setOpen} position={position}>
            <ToastTitle>Awesome toast</ToastTitle>
            <ToastDescription>
              Made with RadixUI and TailwindCSS
            </ToastDescription>
            <ToastClose />
          </Toast>

          <ToastViewport />
        </ToastProvider>
      </div>
    </div>
  )
}
