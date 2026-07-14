import { cn } from "@/lib/utils"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/new-york-v4/ui/alert"

export function Callout({
  title,
  children,
  icon,
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof Alert> & {
  icon?: React.ReactNode
  variant?: "default" | "info" | "warning"
}) {
  return (
    <Alert
      data-variant={variant}
      className={cn(
        "not-typeset mt-6 w-auto rounded-2xl border-surface bg-surface text-surface-foreground md:-mx-1 **:[code]:border",
        className
      )}
      {...props}
    >
      {icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className="text-card-foreground/80">
        {children}
      </AlertDescription>
    </Alert>
  )
}
