import { Info } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/default/ui/alert"

export default function AlertInformative() {
  return (
    <Alert variant="informative">
      <Info className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        Please pay attention to this information.
      </AlertDescription>
    </Alert>
  )
}
