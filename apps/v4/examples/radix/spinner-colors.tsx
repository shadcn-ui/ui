import { Spinner } from "@/styles/radix-force-ui/ui/spinner"

export function SpinnerColors() {
  return (
    <div className="flex items-center gap-6">
      <Spinner color="default" />
      <Spinner color="primary" />
      <Spinner color="inherit" />
      <div className="rounded-md bg-primary p-2">
        <Spinner color="onPrimary" />
      </div>
    </div>
  )
}
