import { Spinner } from "@/examples/base/ui/spinner"

export function SpinnerBasic() {
  return (
    <div className="flex items-center gap-6">
      <Spinner />
      <Spinner className="size-6" />
    </div>
  )
}
