import { Spinner } from "@/registry/default/ui/spinner"

export default function SpinnerSizes() {
  return (
    <div className="flex items-center space-x-4">
      <Spinner size="sm" className="bg-green-500" />
      <Spinner size="md" className="bg-blue-500" />
      <Spinner size="lg" className="bg-red-500" />
    </div>
  )
}
