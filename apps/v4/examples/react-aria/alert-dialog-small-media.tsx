import { BluetoothIcon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/styles/react-aria-nova/ui/alert-dialog"
import { Button } from "@/styles/react-aria-nova/ui/button"

export function AlertDialogSmallWithMedia() {
  return (
    <AlertDialogTrigger>
      <Button variant="outline">Show Dialog</Button>
      <AlertDialog size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <BluetoothIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to allow the USB accessory to connect to this device?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
          <AlertDialogAction>Allow</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    </AlertDialogTrigger>
  )
}
