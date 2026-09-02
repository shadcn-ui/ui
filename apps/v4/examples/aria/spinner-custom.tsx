import { LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({
  className,
  label = "Loading",
  ...props
}: React.ComponentProps<"svg"> & { label?: string }) {
  return (
    <>
      <LoaderIcon
        aria-hidden="true"
        data-slot="spinner"
        className={cn("size-4 animate-spin", className)}
        {...props}
      />
      {label ? (
        <span role="status" className="sr-only">
          {label}
        </span>
      ) : null}
    </>
  )
}

export function SpinnerCustom() {
  return (
    <div className="flex items-center gap-4">
      <Spinner />
    </div>
  )
}
