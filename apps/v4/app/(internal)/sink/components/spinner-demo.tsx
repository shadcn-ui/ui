import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/new-york-v4/ui/empty"
import { Field, FieldLabel } from "@/registry/new-york-v4/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/new-york-v4/ui/input-group"
import { Spinner } from "@/registry/new-york-v4/ui/spinner"

export function SpinnerDemo() {
  return (
    <div className="flex w-full flex-col gap-12">
      <div className="flex items-center gap-6">
        <Spinner />
        <Spinner className="size-8" />
      </div>
      <div className="flex items-center gap-6">
        <Button>
          <Spinner /> Submit
        </Button>
        <Button disabled>
          <Spinner /> Disabled
        </Button>
        <Button size="sm">
          <Spinner /> Small
        </Button>
        <Button variant="outline" disabled>
          <Spinner /> Outline
        </Button>
        <Button variant="outline" size="icon" disabled>
          <Spinner />
          <span className="sr-only">Loading...</span>
        </Button>
        <Button variant="destructive" disabled>
          <Spinner />
          Remove
        </Button>
      </div>
      <div className="flex items-center gap-6">
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
      <div className="flex max-w-xs items-center gap-6">
        <Field>
          <FieldLabel htmlFor="input-group-spinner">Input Group</FieldLabel>
          <InputGroup>
            <InputGroupInput id="input-group-spinner" />
            <InputGroupAddon>
              <Spinner />
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </div>
      <Empty className="min-h-[80svh]">
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
              Learn more <ArrowRightIcon />
            </a>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
