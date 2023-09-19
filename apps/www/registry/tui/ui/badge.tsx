import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import colors from "tailwindcss/colors"
import { cn } from "@/lib/utils"
import { Icon, IconType } from "./icon"

const badgeVariants = cva(
  "inline-flex items-center font-medium",
  {
    variants: {
      variant: {
        default:
          "gap-x-1.5 rounded-md bg-primary text-primary-foreground ring-1 ring-inset",
        flat:
          "rounded-md bg-primary text-primary-foreground",
        borderPill: "rounded-full bg-primary text-primary-foreground ring-1 ring-inset",
        flatPill: "rounded-full bg-primary text-primary-foreground",
        outline: "rounded-md ring-1 ring-inset ring-gray-200",
        dot: "gap-x-1.5 rounded-md ring-1 ring-inset ring-gray-200"
      },
      fontSize: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      },
      size: {
        default: "px-2 py-1",
        sm: "px-1.5 py-0.5",
      },
      rounded: {
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
        none: "rounded-none",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fontSize: "xs",
      rounded: "md"
    },
  }
)


export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> {
  icon?: IconType;
  alignIcon?: "left" | "right";
  iconStyle?: string;
  color?: "black" | "white" | "slate" | "gray" | "zinc" | "neutral" | "stone" |
  "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan"
  | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose"
}

function Badge({ children, className, variant, fontSize, size, icon,alignIcon,iconStyle, rounded, color, ...props }: BadgeProps) {
  const badgeColor = (color?: string) => {
    return `bg-${color}-50 text-${color}-600 ring-${color}-500/10`
  }
  return (
    <div className={cn(badgeVariants({ variant, fontSize, size, rounded }), className, badgeColor(color))} {...props}>
      {typeof icon === "string" && <Icon className={`${alignIcon === "right" ? "order-2 ml-1" : "mr-1"} ${iconStyle}`} name={icon} />}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
