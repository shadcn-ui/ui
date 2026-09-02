import { cn } from "@/registry/bases/aria/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function Spinner({
  className,
  label = "Loading",
  ...props
}: React.ComponentProps<"svg"> & { label?: string }) {
  return (
    <>
      <IconPlaceholder
        lucide="Loader2Icon"
        tabler="IconLoader"
        hugeicons="Loading03Icon"
        phosphor="SpinnerIcon"
        remixicon="RiLoaderLine"
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

export { Spinner }
