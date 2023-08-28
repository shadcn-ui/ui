import { Button } from "@/registry/new-york/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/new-york/ui/dialog"
import { Input } from "@/registry/new-york/ui/input"
import { Label } from "@/registry/new-york/ui/label"
import { ArrowDown, ArrowDownLeft, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUp, ArrowUpLeft, ArrowUpRight, Dot } from "lucide-react"
import { useState } from "react"

type PositionType = "center" | "left" | "right" | "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"

export default function DialogPositionDemo() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<PositionType>('center');

  const show = (position: PositionType) => {
    setPosition(position);
    setVisible(true);
  };

  const onChange = (open: boolean) => {
    if (!open) {
      setVisible(false);
    }
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="justify-content-center mb-2 flex flex-wrap gap-2">
          <Button onClick={() => show('left')} variant="outline">Left <ArrowRight className="ml-2" size={16} /> </Button>
          <Button onClick={() => show('center')} variant="outline">Center <ArrowRight className="ml-2" size={16} /> </Button>
          <Button onClick={() => show('right')} variant="outline">Right <ArrowLeft className="ml-2" size={16} /> </Button>
        </div>
        <div className="justify-content-center mb-2 flex flex-wrap gap-2">
          <Button onClick={() => show('top-left')} variant="outline">Top Left <ArrowDownRight className="ml-2" size={16} /> </Button>
          <Button onClick={() => show('top-center')} variant="outline">Top Center <ArrowDown className="ml-2" size={16} /> </Button>
          <Button onClick={() => show('top-right')} variant="outline">Top Right <ArrowDownLeft className="ml-2" size={16} /> </Button>
        </div>
        <div className="justify-content-center flex flex-wrap gap-2">
          <Button onClick={() => show('bottom-left')} variant="outline">Bottom Left <ArrowUpRight className="ml-2" size={16} /> </Button>
          <Button onClick={() => show('bottom-center')} variant="outline">Bottom Center <ArrowUp className="ml-2" size={16} /> </Button>
          <Button onClick={() => show('bottom-right')} variant="outline">Bottom Right <ArrowUpLeft className="ml-2" size={16} /> </Button>
        </div>
      </div>
      <Dialog open={visible} onOpenChange={onChange}>
        <DialogContent position={position}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">
                Name
              </Label>
              <Input id="name" value="Pedro Duarte" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username">
                Username
              </Label>
              <Input id="username" value="@peduarte" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setVisible(false)} type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
