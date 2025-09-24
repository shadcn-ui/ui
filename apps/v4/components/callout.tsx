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
        "mt-6 w-auto border-none md:-mx-1",
        "data-[variant=default]:text-surface-foreground-foreground data-[variant=default]:bg-surface",
        "data-[variant=info]:bg-blue-50 data-[variant=info]:text-blue-800 dark:data-[variant=info]:bg-blue-950 dark:data-[variant=info]:text-blue-200",
        "data-[variant=warning]:bg-amber-50 data-[variant=warning]:text-amber-800 dark:data-[variant=warning]:bg-amber-950 dark:data-[variant=warning]:text-amber-200",
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
