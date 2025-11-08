import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/radix/ui/alert-dialog"
import { Button } from "@/registry/radix/ui/button"
import { CanvaFrame } from "@/app/(design)/design/components/canva"

export default function AlertDialogDemo() {
  return (
    <CanvaFrame>
        <div className="flex gap-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Show Dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Connect Mouse</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-xs">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center">
                  Allow accessory to connect?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center">
                  Do you want to allow the USB accessory to connect to this
                  device?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="grid grid-cols-2 gap-4">
                <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
                <AlertDialogAction>Allow</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CanvaFrame>
  )
}
