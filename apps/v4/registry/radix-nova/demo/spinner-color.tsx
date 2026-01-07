import { Spinner } from "@/registry/radix-nova/ui/spinner"

export function SpinnerColor() {
  return (
    <div className="flex items-center gap-6">
      <Spinner className="size-6 text-red-500" />
      <Spinner className="size-6 text-green-500" />
      <Spinner className="size-6 text-blue-500" />
      <Spinner className="size-6 text-yellow-500" />
      <Spinner className="size-6 text-purple-500" />
    </div>
  )
}
