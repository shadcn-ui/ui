"use client"

import * as React from "react"
import { cn } from "cn"
import {
  Button as ButtonPrimitive,
  type ButtonProps,
} from "react-aria-components"

import {
  Collapsible,
  CollapsibleContent,
} from "@/registry/bases/aria/ui/collapsible"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function Trace({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="trace"
      className={cn(
        "cn-trace flex w-full min-w-0 flex-col *:has-[>[data-slot=trace-line]]:flex *:has-[>[data-slot=trace-line]]:w-fit *:has-[>[data-slot=trace-line]]:max-w-full *:has-[>[data-slot=trace-line]]:min-w-0 *:has-[>[data-slot=trace-line]]:text-left *:has-[>[data-slot=trace-line]]:outline-none",
        className
      )}
      {...props}
    />
  )
}

function TraceLine({
  className,
  status,
  ...props
}: React.ComponentProps<"span"> & {
  status?: "running" | "error" | "pending"
}) {
  return (
    <span
      data-slot="trace-line"
      data-status={status}
      className={cn(
        "cn-trace-line flex w-fit max-w-full min-w-0 items-center text-muted-foreground transition-colors in-[a,button]:cursor-pointer in-[a:hover,button:hover]:text-foreground data-[status=error]:text-destructive data-[status=error]:in-[a:hover,button:hover]:text-destructive data-[status=pending]:opacity-60 data-[status=running]:*:data-[slot=trace-title]:shimmer",
        className
      )}
      {...props}
    />
  )
}

function TraceIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-icon"
      aria-hidden="true"
      className={cn(
        "cn-trace-icon flex shrink-0 items-center justify-center [&_svg]:pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

function TraceTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-title"
      className={cn(
        "cn-trace-title min-w-0 truncate motion-reduce:shimmer-none",
        className
      )}
      {...props}
    />
  )
}

function TraceDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-description"
      className={cn(
        "cn-trace-description shrink-0 text-muted-foreground/70 tabular-nums",
        className
      )}
      {...props}
    />
  )
}

function TraceCollapsible({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Collapsible>, "isExpanded" | "className"> &
  (
    | { isExpanded?: undefined }
    | {
        isExpanded: boolean
        onExpandedChange: NonNullable<
          React.ComponentProps<typeof Collapsible>["onExpandedChange"]
        >
      }
  ) & {
    className?: string
  }) {
  return (
    <Collapsible
      data-slot="trace-collapsible"
      className={cn(
        "cn-trace-collapsible flex w-full min-w-0 flex-col",
        className
      )}
      {...props}
    />
  )
}

function TraceCollapsibleTrigger({
  className,
  children,
  ...props
}: Omit<ButtonProps, "className" | "children" | "slot"> & {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <ButtonPrimitive
      slot="trigger"
      {...props}
      data-slot="trace-collapsible-trigger"
      className={cn(
        "cn-trace-collapsible-trigger group/trace-collapsible-trigger flex w-fit max-w-full min-w-0 cursor-pointer items-center text-left text-muted-foreground transition-colors outline-none hover:text-foreground has-[[data-status=error]]:text-destructive",
        className
      )}
    >
      {children}
      <TraceIcon className="transition-transform group-aria-expanded/trace-collapsible-trigger:rotate-90">
        <IconPlaceholder
          lucide="ChevronRightIcon"
          tabler="IconChevronRight"
          hugeicons="ArrowRight01Icon"
          phosphor="CaretRightIcon"
          remixicon="RiArrowRightSLine"
        />
      </TraceIcon>
    </ButtonPrimitive>
  )
}

function TraceCollapsibleContent({
  className,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof CollapsibleContent>,
  "className" | "children"
> & {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <CollapsibleContent
      data-slot="trace-collapsible-content"
      className="cn-trace-collapsible-content h-(--disclosure-panel-height) min-w-0 overflow-clip transition-[height]"
      {...props}
    >
      <div
        data-slot="trace-collapsible-content-inner"
        className={cn(
          "cn-trace-collapsible-content-inner min-w-0 wrap-break-word text-muted-foreground",
          className
        )}
      >
        {children}
      </div>
    </CollapsibleContent>
  )
}

export {
  Trace,
  TraceLine,
  TraceIcon,
  TraceTitle,
  TraceDescription,
  TraceCollapsible,
  TraceCollapsibleTrigger,
  TraceCollapsibleContent,
}
