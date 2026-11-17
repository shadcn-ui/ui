/**
 * @license MIT
 * Copyright (c) Acme
 */
"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/registry/acme/lib/utils";
import { buttonVariants } from "@/registry/acme/ui/button";

function Panel({
  side = "left",
  className,
  classNames,
  ...props
}: React.ComponentProps<typeof DayPicker> & { side?: "left" | "right" }) {
  return (
    <div
      data-side={side}
      className={cn(
        "flex space-x-2 border-l pl-4 data-[side=left]:-translate-x-full",
        side === "right" ? "right-0 ml-auto" : "left-0 mr-auto",
        className
      )}
    >
      <DayPicker
        classNames={{
          root: "relative pr-2",
          nav: cn("absolute top-0 right-0", "flex items-center"),
          button_previous: cn(
            buttonVariants({ variant: "ghost" }),
            "rounded-l-md"
          ),
          variant: "outline",
          ...classNames,
        }}
        {...props}
      />
    </div>
  );
}

export { Panel };
