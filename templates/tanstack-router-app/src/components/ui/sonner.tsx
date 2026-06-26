import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon materialSymbols="check_circle" className="size-4" />
        ),
        info: (
          <InfoIcon materialSymbols="info" className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon materialSymbols="warning" className="size-4" />
        ),
        error: (
          <OctagonXIcon materialSymbols="dangerous" className="size-4" />
        ),
        loading: (
          <Loader2Icon materialSymbols="progress_activity" className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
