import { CanvaFrame } from "@/components/canva"
import { Badge } from "@/registry/bases/radix/ui/badge"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/bases/radix/ui/empty"
import { Field, FieldLabel } from "@/registry/bases/radix/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/bases/radix/ui/input-group"
import { Spinner } from "@/registry/bases/radix/ui/spinner"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

export default function SpinnerExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <SpinnerBasic />
        <SpinnerInButtons />
        <SpinnerInBadges />
        <SpinnerInInputGroup />
        <SpinnerInEmpty />
      </div>
    </div>
  )
}

function SpinnerBasic() {
  return (
    <CanvaFrame title="Basic">
      <div className="flex items-center gap-6">
        <Spinner />
        <Spinner className="size-8" />
      </div>
    </CanvaFrame>
  )
}

function SpinnerInButtons() {
  return (
    <CanvaFrame title="In Buttons">
      <div className="flex flex-wrap items-center gap-4">
        <Button>
          <Spinner data-slot="icon-align" /> Submit
        </Button>
        <Button disabled>
          <Spinner data-slot="icon-align" /> Disabled
        </Button>
        <Button variant="outline" disabled>
          <Spinner data-slot="icon-align" /> Outline
        </Button>
        <Button variant="outline" size="icon" disabled>
          <Spinner data-slot="icon-align" />
          <span className="sr-only">Loading...</span>
        </Button>
      </div>
    </CanvaFrame>
  )
}

function SpinnerInBadges() {
  return (
    <CanvaFrame title="In Badges">
      <div className="flex flex-wrap items-center gap-4">
        <Badge>
          <Spinner />
          Badge
        </Badge>
        <Badge variant="secondary">
          <Spinner />
          Badge
        </Badge>
        <Badge variant="destructive">
          <Spinner />
          Badge
        </Badge>
        <Badge variant="outline">
          <Spinner />
          Badge
        </Badge>
      </div>
    </CanvaFrame>
  )
}

function SpinnerInInputGroup() {
  return (
    <CanvaFrame title="In Input Group">
      <Field>
        <FieldLabel htmlFor="input-group-spinner">Input Group</FieldLabel>
        <InputGroup>
          <InputGroupInput id="input-group-spinner" />
          <InputGroupAddon>
            <Spinner />
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </CanvaFrame>
  )
}

function SpinnerInEmpty() {
  return (
    <CanvaFrame title="In Empty State">
      <Empty className="min-h-[300px]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any projects yet. Get started by creating
            your first project.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button asChild>
              <a href="#">Create project</a>
            </Button>
            <Button variant="outline">Import project</Button>
          </div>
          <Button variant="link" asChild className="text-muted-foreground">
            <a href="#">
              Learn more{" "}
              <IconPlaceholder
                lucide="ArrowRightIcon"
                tabler="IconArrowRight"
                hugeicons="ArrowRight02Icon"
              />
            </a>
          </Button>
        </EmptyContent>
      </Empty>
    </CanvaFrame>
  )
}
