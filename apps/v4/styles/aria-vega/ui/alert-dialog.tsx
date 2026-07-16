"use client"

import * as React from "react"
import {
  Dialog as AlertDialogPrimitive,
  DialogTrigger as AlertDialogTriggerPrimitive,
  Heading,
  ModalOverlay as ModalOverlayPrimitive,
  Modal as ModalPrimitive,
  type DialogProps as AlertDialogPrimitiveProps,
  type DialogTriggerProps as AlertDialogTriggerPrimitiveProps,
  type ModalOverlayProps as ModalOverlayPrimitiveProps,
  type ModalRenderProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"
import { Button } from "@/styles/aria-vega/ui/button"

function AlertDialogTrigger({ ...props }: AlertDialogTriggerPrimitiveProps) {
  return <AlertDialogTriggerPrimitive {...props} />
}

function AlertDialogOverlay({
  className,
  children,
  ...props
}: Omit<ModalOverlayPrimitiveProps, "className" | "children"> & {
  className?: string
  children: React.ReactNode
}) {
  return (
    <ModalOverlayPrimitive
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      // Keep existing data-open/data-closed selectors working with RAC state.
      render={(renderProps, state: ModalRenderProps) => (
        <div
          {...renderProps}
          data-open={!state.isExiting}
          data-closed={state.isExiting}
        />
      )}
      {...props}
    >
      {children}
    </ModalOverlayPrimitive>
  )
}

function AlertDialog({
  className,
  size = "default",
  children,
  ...props
}: Omit<ModalOverlayPrimitiveProps, "className" | "children"> &
  Pick<React.ComponentProps<typeof ModalPrimitive>, "isDismissable"> & {
    className?: string
    size?: "default" | "sm"
    children: React.ReactNode
  }) {
  return (
    <AlertDialogOverlay {...props}>
      <ModalPrimitive
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-6 rounded-xl bg-popover p-6 text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-lg data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        // Keep existing data-open/data-closed selectors working with RAC state.
        render={(renderProps, state: ModalRenderProps) => (
          <div
            {...renderProps}
            data-open={!state.isExiting}
            data-closed={state.isExiting}
          />
        )}
      >
        <AlertDialogPrimitive
          data-slot="alert-dialog"
          role="alertdialog"
          className="[display:inherit] [gap:inherit] outline-none"
        >
          {children}
        </AlertDialogPrimitive>
      </ModalPrimitive>
    </AlertDialogOverlay>
  )
}

function AlertDialogContent({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof AlertDialog>) {
  return (
    <AlertDialog className={className} size={size} {...props}>
      {children}
    </AlertDialog>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "mb-2 inline-flex size-16 items-center justify-center rounded-md bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-8",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Heading>, "slot">) {
  return (
    <Heading
      slot="title"
      data-slot="alert-dialog-title"
      className={cn(
        "cn-font-heading text-lg font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "slot">) {
  return (
    <div
      data-slot="alert-dialog-description"
      className={cn(
        "text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      slot="close"
      data-slot="alert-dialog-action"
      className={cn(className)}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      slot="close"
      data-slot="alert-dialog-cancel"
      className={cn(className)}
      variant={variant}
      size={size}
      {...props}
    />
  )
}

export type { AlertDialogPrimitiveProps, AlertDialogTriggerPrimitiveProps }

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
}
