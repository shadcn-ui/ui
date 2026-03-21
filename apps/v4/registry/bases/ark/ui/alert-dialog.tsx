"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import {
  Dialog as DialogPrimitive,
  useDialog as useAlertDialog,
  useDialogContext as useAlertDialogContext,
  type DialogOpenChangeDetails as AlertDialogOpenChangeDetails,
} from "@ark-ui/react/dialog"
import { Portal } from "@ark-ui/react/portal"

import { cn } from "@/registry/bases/ark/lib/utils"
import { Button } from "@/registry/bases/ark/ui/button"

function AlertDialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Backdrop>) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className={cn("cn-alert-dialog-overlay fixed inset-0 z-50", className)}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  size?: "default" | "sm"
}) {
  return (
    <Portal>
      <AlertDialogOverlay />
      <DialogPrimitive.Positioner className="fixed inset-0 z-50 flex items-center justify-center">
        <DialogPrimitive.Content
          data-slot="alert-dialog-content"
          data-size={size}
          role="alertdialog"
          className={cn(
            "cn-alert-dialog-content group/alert-dialog-content z-50 grid w-full outline-none",
            className
          )}
          {...props}
        />
      </DialogPrimitive.Positioner>
    </Portal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      data-slot="alert-dialog-header"
      className={cn("cn-alert-dialog-header", className)}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      data-slot="alert-dialog-footer"
      className={cn(
        "cn-alert-dialog-footer flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogMedia({
  className,
  ...props
}: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      data-slot="alert-dialog-media"
      className={cn("cn-alert-dialog-media", className)}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("cn-alert-dialog-title", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("cn-alert-dialog-description", className)}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.CloseTrigger> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <Button variant={variant} size={size} asChild>
      <DialogPrimitive.CloseTrigger
        data-slot="alert-dialog-action"
        className={cn("cn-alert-dialog-action", className)}
        {...props}
      />
    </Button>
  )
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.CloseTrigger> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <Button variant={variant} size={size} asChild>
      <DialogPrimitive.CloseTrigger
        data-slot="alert-dialog-cancel"
        className={cn("cn-alert-dialog-cancel", className)}
        {...props}
      />
    </Button>
  )
}

const AlertDialogContext = DialogPrimitive.Context
const AlertDialogRootProvider = DialogPrimitive.RootProvider

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogContext,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogRootProvider,
  AlertDialogTitle,
  AlertDialogTrigger,
  useAlertDialog,
  useAlertDialogContext,
  type AlertDialogOpenChangeDetails,
}
