import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/aria/components/example"
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
} from "@/registry/bases/aria/ui/alert-dialog"
import { Button } from "@/registry/bases/aria/ui/button"
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/aria/ui/dialog"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function AlertDialogExample() {
  return (
    <ExampleWrapper>
      <AlertDialogBasic />
      <AlertDialogSmall />
      <AlertDialogWithMedia />
      <AlertDialogSmallWithMedia />
      <AlertDialogDestructive />
      <AlertDialogInDialog />
    </ExampleWrapper>
  )
}

function AlertDialogBasic() {
  return (
    <Example title="Basic" className="items-center">
      <AlertDialogTrigger>
        <Button variant="outline">Default</Button>
        <AlertDialog>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialog>
      </AlertDialogTrigger>
    </Example>
  )
}

function AlertDialogSmall() {
  return (
    <Example title="Small" className="items-center">
      <AlertDialogTrigger>
        <Button variant="outline">Small</Button>
        <AlertDialog size="sm">
          <AlertDialogHeader>
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
    </Example>
  )
}

function AlertDialogWithMedia() {
  return (
    <Example title="With Media" className="items-center">
      <AlertDialogTrigger>
        <Button variant="outline">Default (Media)</Button>
        <AlertDialog>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <IconPlaceholder
                lucide="BluetoothIcon"
                tabler="IconBluetooth"
                hugeicons="BluetoothIcon"
                phosphor="BluetoothIcon"
                remixicon="RiBluetoothLine"
              />
            </AlertDialogMedia>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account and remove your data
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialog>
      </AlertDialogTrigger>
    </Example>
  )
}

function AlertDialogSmallWithMedia() {
  return (
    <Example title="Small With Media" className="items-center">
      <AlertDialogTrigger>
        <Button variant="outline">Small (Media)</Button>

        <AlertDialog size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <IconPlaceholder
                lucide="BluetoothIcon"
                tabler="IconBluetooth"
                hugeicons="BluetoothIcon"
                phosphor="BluetoothIcon"
                remixicon="RiBluetoothLine"
              />
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
    </Example>
  )
}

function AlertDialogDestructive() {
  return (
    <Example title="Destructive" className="items-center">
      <AlertDialogTrigger>
        <Button variant="destructive">Delete Chat</Button>
        <AlertDialog size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <IconPlaceholder
                lucide="Trash2Icon"
                tabler="IconTrash"
                hugeicons="Delete02Icon"
                phosphor="TrashIcon"
                remixicon="RiDeleteBinLine"
              />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chat conversation. View{" "}
              <a href="#">Settings</a> delete any memories saved during this
              chat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="ghost">Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialog>
      </AlertDialogTrigger>
    </Example>
  )
}

function AlertDialogInDialog() {
  return (
    <Example title="In Dialog" className="items-center">
      <DialogTrigger>
        <Button variant="outline">Open Dialog</Button>
        <Dialog>
          <DialogHeader>
            <DialogTitle>Alert Dialog Example</DialogTitle>
            <DialogDescription>
              Click the button below to open an alert dialog.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <AlertDialogTrigger>
              <Button>Open Alert Dialog</Button>
              <AlertDialog size="sm">
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
              </AlertDialog>
            </AlertDialogTrigger>
          </DialogFooter>
        </Dialog>
      </DialogTrigger>
    </Example>
  )
}
