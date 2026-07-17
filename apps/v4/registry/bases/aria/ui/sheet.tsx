"use client"

import * as React from "react"
import {
  Heading,
  ModalOverlay as ModalOverlayPrimitive,
  Modal as ModalPrimitive,
  Dialog as SheetPrimitive,
  DialogTrigger as SheetTriggerPrimitive,
  type ModalOverlayProps as ModalOverlayPrimitiveProps,
  type DialogProps as SheetPrimitiveProps,
  type DialogTriggerProps as SheetTriggerPrimitiveProps,
} from "react-aria-components"

import { cn } from "@/registry/bases/aria/lib/utils"
import { Button } from "@/registry/bases/aria/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function SheetTrigger({ ...props }: SheetTriggerPrimitiveProps) {
  return <SheetTriggerPrimitive data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  className,
  variant = "outline",
  size = "default",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      slot="close"
      data-slot="sheet-close"
      variant={variant}
      size={size}
      className={cn(className)}
      {...props}
    />
  )
}

function SheetOverlay({
  className,
  children,
  ...props
}: Omit<ModalOverlayPrimitiveProps, "className" | "children"> & {
  className?: string
  children: React.ReactNode
}) {
  return (
    <ModalOverlayPrimitive
      data-slot="sheet-overlay"
      isDismissable
      className={cn(
        "cn-sheet-overlay fixed inset-0 z-50 transition-opacity duration-150 data-entering:opacity-0 data-exiting:opacity-0",
        className
      )}
      {...props}
    >
      {children}
    </ModalOverlayPrimitive>
  )
}

function Sheet({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: Omit<ModalOverlayPrimitiveProps, "className" | "children"> &
  Pick<React.ComponentProps<typeof ModalPrimitive>, "isDismissable"> & {
    className?: string
    children: React.ReactNode
    side?: "top" | "right" | "bottom" | "left"
    showCloseButton?: boolean
  }) {
  return (
    <SheetOverlay {...props}>
      <ModalPrimitive
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "cn-sheet-content data-entering:opacity-0 data-exiting:opacity-0 data-[side=bottom]:data-entering:translate-y-[2.5rem] data-[side=bottom]:data-exiting:translate-y-[2.5rem] data-[side=left]:data-entering:translate-x-[-2.5rem] data-[side=left]:data-exiting:translate-x-[-2.5rem] data-[side=right]:data-entering:translate-x-[2.5rem] data-[side=right]:data-exiting:translate-x-[2.5rem] data-[side=top]:data-entering:translate-y-[-2.5rem] data-[side=top]:data-exiting:translate-y-[-2.5rem]",
          className
        )}
      >
        <SheetPrimitive
          data-slot="sheet"
          className="[display:inherit] h-full max-h-[inherit] [flex-direction:inherit] [gap:inherit] outline-none"
        >
          {children}
          {showCloseButton && (
            <SheetClose
              variant="ghost"
              className="cn-sheet-close"
              size="icon-sm"
            >
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
              <span className="sr-only">Close</span>
            </SheetClose>
          )}
        </SheetPrimitive>
      </ModalPrimitive>
    </SheetOverlay>
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Sheet> & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}) {
  return (
    <Sheet
      className={className}
      side={side}
      showCloseButton={showCloseButton}
      {...props}
    >
      {children}
    </Sheet>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("cn-sheet-header flex flex-col", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("cn-sheet-footer mt-auto flex flex-col", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Heading>, "slot">) {
  return (
    <Heading
      slot="title"
      data-slot="sheet-title"
      className={cn("cn-sheet-title cn-font-heading", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "slot">) {
  return (
    <div
      data-slot="sheet-description"
      className={cn("cn-sheet-description", className)}
      {...props}
    />
  )
}

export {
  type SheetPrimitiveProps,
  type SheetTriggerPrimitiveProps,
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
