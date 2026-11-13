import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/aria/components/example"
import { Button } from "@/registry/bases/aria/ui/button"
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/aria/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/registry/bases/aria/ui/field"
import { Input } from "@/registry/bases/aria/ui/input"
import {
  Popover,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/bases/aria/ui/popover"

export default function PopoverExample() {
  return (
    <ExampleWrapper>
      <PopoverBasic />
      <PopoverSides />
      <PopoverWithForm />
      <PopoverAlignments />
      <PopoverInDialog />
    </ExampleWrapper>
  )
}

function PopoverBasic() {
  return (
    <Example title="Basic">
      <PopoverTrigger>
        <Button variant="outline" className="w-fit">
          Open Popover
        </Button>
        <Popover placement="bottom start">
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>
              Set the dimensions for the layer.
            </PopoverDescription>
          </PopoverHeader>
        </Popover>
      </PopoverTrigger>
    </Example>
  )
}

function PopoverSides() {
  return (
    <Example title="Sides">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {(["start", "left", "top"] as const).map((placement) => {
            return (
              <PopoverTrigger key={placement}>
                <Button variant="outline" className="w-fit capitalize">
                  {placement}
                </Button>
                <Popover placement={placement} className="w-40">
                  <p>Popover on {placement}</p>
                </Popover>
              </PopoverTrigger>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          {(["bottom", "right", "end"] as const).map((placement) => {
            return (
              <PopoverTrigger key={placement}>
                <Button variant="outline" className="w-fit capitalize">
                  {placement}
                </Button>
                <Popover placement={placement} className="w-40">
                  <p>Popover on {placement}</p>
                </Popover>
              </PopoverTrigger>
            )
          })}
        </div>
      </div>
    </Example>
  )
}

function PopoverWithForm() {
  return (
    <Example title="With Form">
      <PopoverTrigger>
        <Button variant="outline">Open Popover</Button>
        <Popover className="w-64" placement="bottom start">
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>
              Set the dimensions for the layer.
            </PopoverDescription>
          </PopoverHeader>
          <FieldGroup className="gap-4">
            <Field orientation="horizontal">
              <FieldLabel htmlFor="width" className="w-1/2">
                Width
              </FieldLabel>
              <Input id="width" defaultValue="100%" />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="height" className="w-1/2">
                Height
              </FieldLabel>
              <Input id="height" defaultValue="25px" />
            </Field>
          </FieldGroup>
        </Popover>
      </PopoverTrigger>
    </Example>
  )
}

function PopoverAlignments() {
  return (
    <Example title="Alignments">
      <div className="flex gap-6">
        <PopoverTrigger>
          <Button variant="outline" size="sm">
            Start
          </Button>
          <Popover placement="bottom start" className="w-40">
            Aligned to start
          </Popover>
        </PopoverTrigger>
        <PopoverTrigger>
          <Button variant="outline" size="sm">
            Center
          </Button>
          <Popover placement="bottom" className="w-40">
            Aligned to center
          </Popover>
        </PopoverTrigger>
        <PopoverTrigger>
          <Button variant="outline" size="sm">
            End
          </Button>
          <Popover placement="bottom end" className="w-40">
            Aligned to end
          </Popover>
        </PopoverTrigger>
      </div>
    </Example>
  )
}

function PopoverInDialog() {
  return (
    <Example title="In Dialog">
      <DialogTrigger>
        <Button variant="outline">Open Dialog</Button>
        <Dialog>
          <DialogHeader>
            <DialogTitle>Popover Example</DialogTitle>
            <DialogDescription>
              Click the button below to see the popover.
            </DialogDescription>
          </DialogHeader>
          <PopoverTrigger>
            <Button variant="outline" className="w-fit">
              Open Popover
            </Button>
            <Popover placement="bottom start">
              <PopoverHeader>
                <PopoverTitle>Popover in Dialog</PopoverTitle>
                <PopoverDescription>
                  This popover appears inside a dialog. Click the button to open
                  it.
                </PopoverDescription>
              </PopoverHeader>
            </Popover>
          </PopoverTrigger>
        </Dialog>
      </DialogTrigger>
    </Example>
  )
}
