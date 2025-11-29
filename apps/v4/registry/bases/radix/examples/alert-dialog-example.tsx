import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/radix/components/example"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/bases/radix/ui/alert-dialog"
import { Button } from "@/registry/bases/radix/ui/button"
import { IconPlaceholder } from "@/app/(design)/components/icon-placeholder"

export default function AlertDialogExample() {
  return (
    <ExampleWrapper>
      <AlertDialogBasic />
      <AlertDialogSmall />
      <AlertDialogWithMedia />
      <AlertDialogSmallWithMedia />
      <AlertDialogDestructive />
      <AlertDialogWithIconTrigger />
    </ExampleWrapper>
  )
}

function AlertDialogBasic() {
  return (
    <Example title="Basic">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Default</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
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
        </AlertDialogContent>
      </AlertDialog>
    </Example>
  )
}

function AlertDialogSmall() {
  return (
    <Example title="Small">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Small</Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
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
        </AlertDialogContent>
      </AlertDialog>
    </Example>
  )
}

function AlertDialogWithMedia() {
  return (
    <Example title="With Media">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Default (Media)</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <IconPlaceholder
                lucide="BluetoothIcon"
                tabler="IconBluetooth"
                hugeicons="BluetoothIcon"
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
        </AlertDialogContent>
      </AlertDialog>
    </Example>
  )
}

function AlertDialogSmallWithMedia() {
  return (
    <Example title="Small With Media">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Small (Media)</Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <IconPlaceholder
                lucide="BluetoothIcon"
                tabler="IconBluetooth"
                hugeicons="BluetoothIcon"
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
        </AlertDialogContent>
      </AlertDialog>
    </Example>
  )
}

function AlertDialogDestructive() {
  return (
    <Example title="Destructive">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete Chat</Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <IconPlaceholder
                lucide="Trash2Icon"
                tabler="IconTrash"
                hugeicons="Delete02Icon"
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Example>
  )
}

function AlertDialogWithIconTrigger() {
  return (
    <Example title="With Icon Trigger">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>
            <IconPlaceholder
              lucide="HeadphonesIcon"
              tabler="IconHeadphones"
              hugeicons="HeadphonesIcon"
              data-icon="inline-start"
            />
            Connect
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you connecting a pair of headphones?
            </AlertDialogTitle>
            <AlertDialogDescription>
              If you switch devices, you can update this selection in the{" "}
              <a href="#">Sounds & Haptics</a> section of Settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Other Device</AlertDialogCancel>
            <AlertDialogAction>Headphones</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Example>
  )
}
