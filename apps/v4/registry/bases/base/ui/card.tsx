import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/registry/bases/base/lib/utils"

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
        className: cn("cn-card group/card flex flex-col", className),
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
          "cn-card-header group/card-header @container/card-header grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
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
        className: cn("cn-card-title cn-font-heading", className),
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
        className: cn("cn-card-description", className),
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
          "cn-card-action col-start-2 row-span-2 row-start-1 self-start justify-self-end",
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
        className: cn("cn-card-content", className),
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
        className: cn("cn-card-footer flex items-center", className),
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
