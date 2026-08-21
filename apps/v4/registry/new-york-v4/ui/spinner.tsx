import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({
  className,
  label = "Loading",
  ...props
}: React.ComponentProps<"svg"> & { label?: string | null }) {
  const icon = (
    <Loader2Icon
      aria-hidden="true"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )

  if (label == null || label === "") {
    return icon
  }

  return (
    <>
      {icon}
      <span role="status" className="sr-only">
        {label}
      </span>
    </>
  )
}

export { Spinner }
