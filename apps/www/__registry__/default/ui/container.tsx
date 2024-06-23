import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const containerVariants = cva("mx-auto px-4 sm:px-6 lg:px-8", {
  variants: {
    variant: {
      fullMobileConstrainedPadded: "max-w-7xl sm:px-6 lg:px-8",
      constrainedPadded: "max-w-7xl px-4 sm:px-6 lg:px-8",
      fullMobileBreakpointPadded: "container mx-auto sm:px-6 lg:px-8",
      breakpointPadded: "container mx-auto px-4 sm:px-6 lg:px-8",
      narrowConstrainedPadded: "max-w-3xl px-4 sm:px-6 lg:px-8",
    },
  },
  defaultVariants: {
    variant: "narrowConstrainedPadded",
  },
})

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  asChild?: boolean
}

const Container: React.FC<ContainerProps> = ({
  asChild,
  className,
  children,
  variant,
  ...props
}) => {
  const Comp = asChild ? React.Fragment : "div"
  const containerClasses = cn(containerVariants({ variant }), className)

  return (
    <Comp className={containerClasses} {...props}>
      {variant === "narrowConstrainedPadded" ? (
        <div className="mx-auto max-w-3xl">{children}</div>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Container, containerVariants }
