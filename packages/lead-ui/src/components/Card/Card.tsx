import { forwardRef } from "react"
import type { HTMLAttributes } from "react"

import "../../tokens.css"
import "./Card.css"

export type CardPadding = "none" | "sm" | "md" | "lg"
export type CardVariant = "default" | "muted" | "outline"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding
  variant?: CardVariant
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { padding = "md", variant = "default", className, ...rest },
  ref
) {
  const classes = ["lead-Card", className].filter(Boolean).join(" ")
  return (
    <div
      ref={ref}
      {...rest}
      className={classes}
      data-padding={padding}
      data-variant={variant}
    />
  )
})

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ className, ...rest }, ref) {
    const classes = ["lead-CardHeader", className].filter(Boolean).join(" ")
    return <div ref={ref} {...rest} className={classes} />
  }
)

export type CardTitleLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: CardTitleLevel
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ level = 3, className, ...rest }, ref) {
    const classes = ["lead-CardTitle", className].filter(Boolean).join(" ")
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    return <Tag ref={ref} {...rest} className={classes} />
  }
)

export interface CardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(function CardDescription({ className, ...rest }, ref) {
  const classes = ["lead-CardDescription", className].filter(Boolean).join(" ")
  return <p ref={ref} {...rest} className={classes} />
})

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  function CardContent({ className, ...rest }, ref) {
    const classes = ["lead-CardContent", className].filter(Boolean).join(" ")
    return <div ref={ref} {...rest} className={classes} />
  }
)

export type CardFooterAlign = "start" | "end" | "between"

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  align?: CardFooterAlign
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ align = "start", className, ...rest }, ref) {
    const classes = ["lead-CardFooter", className].filter(Boolean).join(" ")
    return (
      <div ref={ref} {...rest} className={classes} data-align={align} />
    )
  }
)
