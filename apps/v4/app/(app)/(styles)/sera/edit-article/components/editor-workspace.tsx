"use client"

import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ChevronDownIcon,
  Code2Icon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  RedoIcon,
  StrikethroughIcon,
  TypeIcon,
  UnderlineIcon,
  UndoIcon,
} from "lucide-react"

import { Button } from "@/styles/base-sera/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/styles/base-sera/ui/button-group"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/styles/base-sera/ui/card"
import { Checkbox } from "@/styles/base-sera/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/styles/base-sera/ui/dropdown-menu"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/styles/base-sera/ui/field"
import { Input } from "@/styles/base-sera/ui/input"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/styles/base-sera/ui/progress"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/styles/base-sera/ui/select"
import { Textarea } from "@/styles/base-sera/ui/textarea"

type Milestone = {
  name: string
  complete: boolean
  note?: string
}

const MILESTONES: Milestone[] = [
  {
    name: "Outline & Commissioning",
    complete: true,
  },
  {
    name: "First Draft Submitted",
    complete: true,
  },
  {
    name: "Review & Revisions",
    complete: false,
    note: "Waiting on editor",
  },
  {
    name: "Final Copy Edit",
    complete: false,
  },
  {
    name: "Art Direction & Layout",
    complete: false,
  },
]

const ISSUES = [
  { label: "Spring Issue 2024", value: "spring-2024" },
  { label: "Summer Issue 2024", value: "summer-2024" },
  { label: "Autumn Issue 2024", value: "autumn-2024" },
  { label: "Winter Issue 2024", value: "winter-2024" },
]

export function EditorWorkspace() {
  return (
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <section className="flex flex-col border border-border/70 bg-background">
        <div className="flex border-b p-2">
          <ButtonGroup>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="sm">
                    Normal Text
                    <ChevronDownIcon data-icon="inline-end" />
                  </Button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <TypeIcon />
                  Normal Text
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Heading1Icon />
                  Heading 1
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Heading2Icon />
                  Heading 2
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Heading3Icon />
                  Heading 3
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ListIcon />
                  Bullet List
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ListOrderedIcon />
                  Numbered List
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ButtonGroupSeparator className="mx-2 data-vertical:h-4 data-vertical:self-center" />
            <Button variant="ghost" size="icon-sm" aria-label="Bold">
              <BoldIcon />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Italic">
              <ItalicIcon />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Underline">
              <UnderlineIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Strikethrough"
              className="hidden md:flex"
            >
              <StrikethroughIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Code"
              className="hidden md:flex"
            >
              <Code2Icon />
            </Button>
            <ButtonGroupSeparator className="mx-2 hidden md:flex data-vertical:h-4 data-vertical:self-center" />
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Align Left"
              className="hidden md:flex"
            >
              <AlignLeftIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Align Center"
              className="hidden md:flex"
            >
              <AlignCenterIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Align Right"
              className="hidden md:flex"
            >
              <AlignRightIcon />
            </Button>
            <ButtonGroupSeparator className="mx-2 hidden md:flex data-vertical:h-4 data-vertical:self-center" />
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Link"
              className="hidden md:flex"
            >
              <LinkIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Image"
              className="hidden md:flex"
            >
              <ImageIcon />
            </Button>
          </ButtonGroup>
          <ButtonGroup className="ml-auto">
            <Button variant="ghost" size="icon-sm" aria-label="Undo">
              <UndoIcon />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Redo">
              <RedoIcon />
            </Button>
          </ButtonGroup>
        </div>
        <div className="mx-auto flex max-w-2xl flex-1 flex-col gap-8 px-10 py-10 leading-loose md:px-14 lg:py-18">
          <h1 className="font-heading text-4xl leading-12 font-medium tracking-wide uppercase">
            The Future of Sustainable Architecture
          </h1>
          <p>
            As cities continue to expand at an unprecedented rate, the
            architectural paradigm is shifting from mere expansion to
            sustainable integration. The concrete jungles of the 20th century
            are making way for structures that breathe, adapt, and give back to
            their environments.
          </p>
          <p>
            Historically, urban development has been a zero-sum game with
            nature.
          </p>
          <h2 className="font-heading text-2xl tracking-wide uppercase">
            The Living Building Challenge
          </h2>
          <p>
            Sterling&apos;s latest project in downtown Seattle is a testament to
            this new philosophy. &quot;We are no longer designing static
            structures,&quot; Sterling explained during a recent site visit.
            &quot;We are engineering localized ecosystems.&quot;
          </p>
          <p>
            The building features a facade of responsive biomaterials that
            adjust their porosity based on humidity and temperature,
            significantly reducing the need for artificial climate control.
            Rainwater is not merely channeled away but captured, filtered
            through a series of integrated rooftop wetlands, and reused within
            the building&apos;s greywater system.
          </p>
          <p className="text-sm text-muted-foreground">
            This shift requires more than just innovative materials; it demands
            a fundamental change in how we value space. Check with engineering
            team for specific stats.
          </p>
        </div>
      </section>
      <aside className="grid grid-cols-12 gap-(--gap) xl:flex xl:flex-col">
        <Card className="col-span-full md:col-span-6 lg:col-span-4">
          <CardHeader>
            <CardTitle>Article Details</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel>Issue</FieldLabel>
                <Select items={ISSUES} defaultValue="summer-2024">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {ISSUES.map((issue) => (
                        <SelectItem key={issue.value} value={issue.value}>
                          {issue.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Author</FieldLabel>
                <Input defaultValue="Elena Rostova" />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
        <Card className="col-span-full md:col-span-6 lg:col-span-4">
          <CardHeader>
            <CardTitle>Publication Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Required Milestones</FieldLegend>
                <Field>
                  {MILESTONES.map((milestone) => (
                    <Field key={milestone.name} orientation="horizontal">
                      <Checkbox
                        defaultChecked={milestone.complete}
                        name={milestone.name}
                        id={milestone.name}
                      />
                      <FieldLabel htmlFor={milestone.name}>
                        {milestone.name}
                      </FieldLabel>
                    </Field>
                  ))}
                </Field>
              </FieldSet>
              <Field>
                <FieldLabel>Add note for editor</FieldLabel>
                <Textarea placeholder="This article needs to be revised for clarity and accuracy." />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Word Count</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={70}>
              <ProgressLabel>1,402 / 2,000 words</ProgressLabel>
              <ProgressValue />
            </Progress>
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}
