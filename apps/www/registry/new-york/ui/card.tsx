import * as React from "react"

import { cn } from "@/lib/utils"

const Card: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
)
Card.displayName = "Card"

const CardHeader: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
)
CardHeader.displayName = "CardHeader"

const CardTitle: React.FC<React.ComponentProps<"h3">> = ({
  className,
  ...props
}) => (
  <h3
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
)
CardTitle.displayName = "CardTitle"

const CardDescription: React.FC<React.ComponentProps<"p">> = ({
  className,
  ...props
}) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
)
CardDescription.displayName = "CardDescription"

const CardContent: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => <div className={cn("p-6 pt-0", className)} {...props} />
CardContent.displayName = "CardContent"

const CardFooter: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
