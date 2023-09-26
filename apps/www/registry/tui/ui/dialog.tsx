"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { Icon, IconType } from "@/registry/tui/ui/icon"
import { CardFooter, CardTitle } from "@/registry/tui/ui/card"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = ({
  className,
  ...props
}: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal className={cn(className)} {...props} />
)
DialogPortal.displayName = DialogPrimitive.Portal.displayName

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  { hideCloseIcon?: boolean } &
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, hideCloseIcon, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[75%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 px-2 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:top-[50%] sm:rounded-lg md:w-full",
        className
      )}
      {...props}
    >
      {children}
      {!hideCloseIcon && <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-0 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <Icon name="xmark-light" className="h-4 w-4 p-0" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const SlideOverContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
  & {
    panelWidth?: 'xs' | 'sm' | 'md' | 'lg' | '2xl' | '5xl' | '7xl',
    disableYscroll?: boolean,
    fixedTitle?: boolean,
    iconName?: IconType,
    closeIconPosition?: 'left' | 'right',
    brandHeader?: boolean,
    brandStyle?: string,
    fixedFooter?: boolean,
    footerContent?: any
  }
>(({ className, children, panelWidth = '5xl', disableYscroll = false, fixedTitle = false, iconName, closeIconPosition = "right", brandHeader = false, brandStyle, fixedFooter, footerContent, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        `fixed right-0 top-0 z-50 grid h-full w-full ${panelWidth ? 'max-w-' + panelWidth : 'max-w-5xl'} gap-4 ${disableYscroll ? 'overflow-hidden' : 'overflow-y-scroll'}
        ${brandHeader || fixedFooter || fixedTitle ? 'p-0' : 'p-6'}
        border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0
        data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-[48%] data-[state=open]:slide-in-from-right-[48%] sm:rounded-l-lg md:w-full`,
        className
      )}
      {...props}
    >
      <div className="flex h-full flex-col overflow-hidden">
        <div className={`flex ${closeIconPosition === 'left' ? 'flex-row-reverse' : 'flex-row'} z-40 h-20 items-center justify-between ${brandHeader ? 'px-4 py-12 ' + brandStyle : ''}`}>
          <CardTitle className={`${fixedTitle ? 'fixed w-full border-b-2 bg-white p-6' : 'p-4'} text-base font-semibold leading-6`}>
            Panel title
          </CardTitle>
          <DialogPrimitive.Close className={`${fixedTitle ? 'fixed' : 'absolute'} ${closeIconPosition === 'left' ? 'left-4' : 'right-4'} top-6 rounded-sm opacity-70 transition-opacity hover:opacity-100
          focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground`}>
            <Icon name={iconName ?? "xmark-solid"} className="h-4 w-4 p-0" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </div>
        <div className={`${brandHeader ? 'px-4' : 'px-0'} overflow-y-scroll px-2`}>
          {children}
        </div>
        <CardFooter className={`${fixedFooter ? 'absolute bottom-0 right-0 w-full border-t-2 bg-white p-6' : ''} flex items-center justify-between text-base`}>
          Footer Title
          {footerContent}
        </CardFooter>
      </div>
    </DialogPrimitive.Content>
  </DialogPortal>
))
SlideOverContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  SlideOverContent
}
