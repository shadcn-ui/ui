import Frame from "@/app/(design)/design/components/frame"
import { Button } from "@/registry/bases/radix/ui/button"
import { Input } from "@/registry/bases/radix/ui/input"
import { Label } from "@/registry/bases/radix/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/radix/ui/popover"

export default function PopoverExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="w-full">
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-12">
          <PopoverBasic />
          <PopoverWithForm />
          <PopoverWithActions />
          <PopoverAlignments />
        </div>
      </div>
    </div>
  )
}

function PopoverBasic() {
  return (
    <Frame title="Basic">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="grid gap-2">
            <h4 className="text-sm font-medium">Dimensions</h4>
            <p className="text-muted-foreground text-sm">
              Set the dimensions for the layer.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </Frame>
  )
}

function PopoverWithForm() {
  return (
    <Frame title="With Form">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <h4 className="leading-none font-medium">Dimensions</h4>
              <p className="text-muted-foreground text-sm">
                Set the dimensions for the layer.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  defaultValue="100%"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxWidth">Max. width</Label>
                <Input
                  id="maxWidth"
                  defaultValue="300px"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  defaultValue="25px"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxHeight">Max. height</Label>
                <Input
                  id="maxHeight"
                  defaultValue="none"
                  className="col-span-2 h-8"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </Frame>
  )
}

function PopoverWithActions() {
  return (
    <Frame title="With Actions">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <h4 className="text-sm font-medium">Are you sure?</h4>
              <p className="text-muted-foreground text-sm">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Cancel
              </Button>
              <Button size="sm" className="flex-1">
                Confirm
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </Frame>
  )
}

function PopoverAlignments() {
  return (
    <Frame title="Alignments">
      <div className="flex flex-col gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              Start
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-40">
            <div className="text-sm">Aligned to start</div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              Center
            </Button>
          </PopoverTrigger>
          <PopoverContent align="center" className="w-40">
            <div className="text-sm">Aligned to center</div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              End
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-40">
            <div className="text-sm">Aligned to end</div>
          </PopoverContent>
        </Popover>
      </div>
    </Frame>
  )
}
