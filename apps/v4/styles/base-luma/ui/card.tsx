import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  render,
  ...props
}: Readonly<useRender.ComponentProps<"div"> & { size?: "default" | "sm" }>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "group/card flex flex-col gap-6 overflow-hidden rounded-4xl bg-card py-6 text-sm text-card-foreground shadow-md ring-1 ring-foreground/5 has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 dark:ring-foreground/10 *:[img:first-child]:rounded-t-4xl *:[img:last-child]:rounded-b-4xl",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "card",
      size,
    },
  })
}

function CardHeader({ className, render, ...props }: Readonly<useRender.ComponentProps<"div">>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 rounded-t-4xl px-6 group-data-[size=sm]/card:px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "card-header",
    },
  })
}

function CardTitle({ className, render, ...props }: Readonly<useRender.ComponentProps<"div">>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn("cn-font-heading text-base font-medium", className),
      },
      props
    ),
    render,
    state: {
      slot: "card-title",
    },
  })
}

function CardDescription({ className, render, ...props }: Readonly<useRender.ComponentProps<"div">>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn("text-sm text-muted-foreground", className),
      },
      props
    ),
    render,
    state: {
      slot: "card-description",
    },
  })
}

function CardAction({ className, render, ...props }: Readonly<useRender.ComponentProps<"div">>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "card-action",
    },
  })
}

function CardContent({ className, render, ...props }: Readonly<useRender.ComponentProps<"div">>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn("px-6 group-data-[size=sm]/card:px-4", className),
      },
      props
    ),
    render,
    state: {
      slot: "card-content",
    },
  })
}

function CardFooter({ className, render, ...props }: Readonly<useRender.ComponentProps<"div">>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex items-center rounded-b-4xl px-6 group-data-[size=sm]/card:px-4 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "card-footer",
    },
  })
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
