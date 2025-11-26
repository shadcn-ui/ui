import { CanvaFrame } from "@/components/canva"
import { Button } from "@/registry/bases/radix/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/registry/bases/radix/ui/field"
import { Input } from "@/registry/bases/radix/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/radix/ui/popover"

export default function PopoverExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <PopoverBasic />
        <PopoverWithForm />
        <PopoverAlignments />
      </div>
    </div>
  )
}

function PopoverBasic() {
  return (
    <CanvaFrame title="Basic">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-fit">
            Open Popover
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <div className="grid gap-2">
            <h4 className="text-sm font-medium">Dimensions</h4>
            <p className="text-muted-foreground text-sm">
              Set the dimensions for the layer.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </CanvaFrame>
  )
}

function PopoverWithForm() {
  return (
    <CanvaFrame title="With Form">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-fit">
            Open Popover
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <h4 className="leading-none font-medium">Dimensions</h4>
              <p className="text-muted-foreground text-sm">
                Set the dimensions for the layer.
              </p>
            </div>
            <FieldGroup className="gap-2">
              <Field orientation="horizontal">
                <FieldLabel htmlFor="width">Width</FieldLabel>
                <Input id="width" defaultValue="100%" className="h-8" />
              </Field>
              <Field orientation="horizontal">
                <FieldLabel htmlFor="maxWidth">Max. width</FieldLabel>
                <Input id="maxWidth" defaultValue="300px" className="h-8" />
              </Field>
              <Field orientation="horizontal">
                <FieldLabel htmlFor="height">Height</FieldLabel>
                <Input id="height" defaultValue="25px" className="h-8" />
              </Field>
              <Field orientation="horizontal">
                <FieldLabel htmlFor="maxHeight">Max. height</FieldLabel>
                <Input id="maxHeight" defaultValue="none" className="h-8" />
              </Field>
            </FieldGroup>
          </div>
        </PopoverContent>
      </Popover>
    </CanvaFrame>
  )
}

function PopoverAlignments() {
  return (
    <CanvaFrame title="Alignments">
      <div className="flex gap-6">
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
    </CanvaFrame>
  )
}
