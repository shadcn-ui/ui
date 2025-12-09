"use client";

import * as React from "react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { buttonVariants } from "./button";
import { buttonGroupVariants } from "./button-group";
import { toggleVariants } from "./toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const toolbarVariants = cva(
  cn(
    "group/toolbar border border-border w-fit inline-flex rounded-xl gap-2",
    "data-[orientation=vertical]:flex-col",
  ),
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        secondary:
          "bg-secondary dark:bg-secondary/50 text-secondary-foreground",
      },
      size: {
        default:
          "data-[orientation=horizontal]:py-2.5 data-[orientation=horizontal]:px-2.5 data-[orientation=vertical]:py-2.5 data-[orientation=vertical]:px-2",
        sm: "data-[orientation=horizontal]:p-1.5 data-[orientation=vertical]:py-2 data-[orientation=vertical]:px-1.5",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

const ToolbarContext = React.createContext<{
  orientation?: "vertical" | "horizontal";
}>({
  orientation: "horizontal",
});

function useToolbar() {
  const context = React.useContext(ToolbarContext);
  if (!context) {
    throw new Error("useToolbar must be used within a ToolbarProvider.");
  }
  return context;
}

function Toolbar({
  className,
  variant,
  size,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Root> &
  VariantProps<typeof toolbarVariants> & {
    orientation?: "vertical" | "horizontal";
  }) {
  return (
    <ToolbarContext.Provider value={{ orientation }}>
      <TooltipProvider>
        <ToolbarPrimitive.Root
          data-slot="toolbar"
          className={cn(toolbarVariants({ variant, size, className }))}
          data-orientation={orientation}
          data-size={size}
          {...props}
        />
      </TooltipProvider>
    </ToolbarContext.Provider>
  );
}

function ToolbarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-row items-center gap-2",
        "group-data-[size=sm]/toolbar:gap-1",
        "group-data-[orientation=vertical]/toolbar:w-full group-data-[orientation=vertical]/toolbar:flex-col group-data-[orientation=vertical]/toolbar:items-start",
        className,
      )}
      data-slot="toolbar-group"
      role="group"
      {...props}
    />
  );
}

function ToolbarButton({
  className,
  size = "sm",
  variant,
  tooltip,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Button> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  }) {
  const { orientation } = useToolbar();

  const button = (
    <ToolbarPrimitive.Button
      className={cn(buttonVariants({ size, variant, className }))}
      data-slot="toolbar-button"
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side={orientation === "vertical" ? "right" : "top"}
        align="center"
        {...tooltip}
      />
    </Tooltip>
  );
}

function ToolbarLink({
  className,
  variant = "link",
  size,
  tooltip,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Link> &
  VariantProps<typeof buttonVariants> & {
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  }) {
  const { orientation } = useToolbar();

  const link = (
    <ToolbarPrimitive.Link
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="toolbar-link"
      {...props}
    />
  );

  if (!tooltip) {
    return link;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent
        side={orientation === "vertical" ? "right" : "top"}
        align="center"
        {...tooltip}
      />
    </Tooltip>
  );
}

function ToolbarSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Separator>) {
  const { orientation: parentOrientation } = useToolbar();
  const finalOrientation = orientation ?? parentOrientation;

  return (
    <ToolbarPrimitive.Separator
      data-orientation={finalOrientation}
      className={cn(
        "bg-border shrink-0",
        "data-[orientation=vertical]:min-h-full data-[orientation=vertical]:w-px",
        "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
        className,
      )}
      data-slot="toolbar-separator"
      {...props}
    />
  );
}

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
    value?: string | string[] | undefined;
    defaultValue?: string | string[] | undefined;
  }
>({
  size: "default",
  variant: "default",
  spacing: 0,
  value: undefined,
});

function ToolbarToggleGroup({
  className,
  variant,
  size = "sm",
  spacing = 0,
  orientation = "horizontal",
  children,
  value,
  defaultValue,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToggleGroup> &
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
  }) {
  const { orientation: parentOrientation } = useToolbar();
  const finalOrientation = orientation ?? parentOrientation;

  return (
    //@ts-ignore
    <ToolbarPrimitive.ToggleGroup
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-orientation={finalOrientation}
      data-spacing={spacing}
      value={value}
      defaultValue={defaultValue}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        "group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{ variant, size, spacing, value, defaultValue }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToolbarPrimitive.ToggleGroup>
  );
}

function ToolbarToggleItem({
  className,
  variant,
  size,
  value,
  tooltip,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToggleItem> &
  VariantProps<typeof toggleVariants> & {
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  }) {
  const context = React.useContext(ToggleGroupContext);
  const { orientation } = useToolbar();

  const groupValue = context.value ?? context.defaultValue;

  const isOn = Array.isArray(groupValue)
    ? groupValue.includes(value)
    : groupValue === value;

  const toggleItem = (
    <ToolbarPrimitive.ToggleItem
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      value={value}
      data-state={isOn ? "on" : "off"}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "w-auto min-w-0 shrink-0 focus:z-10 focus-visible:z-10",
        "data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first:border-l",
        className,
      )}
      {...props}
    />
  );

  if (!tooltip) {
    return toggleItem;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{toggleItem}</TooltipTrigger>
      <TooltipContent
        side={orientation === "vertical" ? "right" : "top"}
        align="center"
        {...tooltip}
      />
    </Tooltip>
  );
}

function ToolbarButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

export {
  Toolbar,
  ToolbarLink,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarButtonGroup,
  ToolbarToggleGroup,
  ToolbarToggleItem,
};
