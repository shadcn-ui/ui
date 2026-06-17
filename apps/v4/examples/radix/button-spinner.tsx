import { Button } from "@/styles/radix-force-ui/ui/button"
import { Spinner } from "@/styles/radix-force-ui/ui/spinner"

export default function ButtonSpinner() {
  return (
    <div className="flex gap-2">
      <Button variant="outline" disabled>
        <Spinner data-icon="inline-start" />
        Generating
      </Button>
      <Button variant="secondary" disabled>
        Downloading
        <Spinner data-icon="inline-start" />
      </Button>
    </div>
  )
}
