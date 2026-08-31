import { Button } from "@/styles/ark-nova/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/styles/ark-nova/ui/drawer"

export function DrawerNonModal() {
  return (
    <Drawer modal={false} closeOnInteractOutside={false} swipeDirection="right">
      <DrawerTrigger asChild>
        <Button variant="outline">Non Modal</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Non Modal Drawer</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 p-4">
          <div className="rounded-2xl bg-muted group-data-[swipe-direction=down]/drawer-content:h-80 group-data-[swipe-direction=down]/drawer-content:w-full group-data-[swipe-direction=left]/drawer-content:size-full group-data-[swipe-direction=right]/drawer-content:size-full" />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
