"use client"

import { FilterIcon, XIcon } from "lucide-react"

import { Badge } from "@/styles/base-sera/ui/badge"
import { Button } from "@/styles/base-sera/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/styles/base-sera/ui/card"
import { Checkbox } from "@/styles/base-sera/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/styles/base-sera/ui/field"
import { Input } from "@/styles/base-sera/ui/input"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/styles/base-sera/ui/radio-group"
import { Separator } from "@/styles/base-sera/ui/separator"
import { Slider } from "@/styles/base-sera/ui/slider"

const FILE_TYPES = [
  {
    id: "images",
    label: "Images (JPEG, PNG, WEBP)",
    defaultChecked: true,
  },
  {
    id: "video",
    label: "Video (MP4, MOV)",
    defaultChecked: false,
  },
  {
    id: "documents",
    label: "Documents (PDF)",
    defaultChecked: false,
  },
  {
    id: "audio",
    label: "Audio (MP3, WAV)",
    defaultChecked: false,
  },
]

const DATE_OPTIONS = [
  { value: "any", label: "Any time" },
  { value: "24h", label: "Past 24 hours" },
  { value: "week", label: "Past week" },
  { value: "month", label: "Past month" },
]

const TAGS = ["architecture", "brutalism", "exterior", "summer-issue"]

export function FilterLibrary() {
  return (
    <Card className="gap-0">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilterIcon className="size-4" />
            <h2 className="font-heading text-lg tracking-wider uppercase">
              Filter Library
            </h2>
          </div>
          <Button variant="ghost" size="icon-sm" aria-label="Close filters">
            <XIcon />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="py-6">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>File Type</FieldLegend>
            <Separator className="-mt-2 mb-2" />
            <Field>
              {FILE_TYPES.map((type) => (
                <Field key={type.id} orientation="horizontal">
                  <Checkbox
                    id={type.id}
                    defaultChecked={type.defaultChecked}
                  />
                  <FieldLabel htmlFor={type.id}>{type.label}</FieldLabel>
                </Field>
              ))}
            </Field>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Date Uploaded</FieldLegend>
            <Separator className="-mt-2 mb-2" />
            <RadioGroup defaultValue="any">
              {DATE_OPTIONS.map((option) => (
                <Field key={option.value} orientation="horizontal">
                  <RadioGroupItem
                    value={option.value}
                    id={`date-${option.value}`}
                  />
                  <FieldLabel htmlFor={`date-${option.value}`}>
                    {option.label}
                  </FieldLabel>
                </Field>
              ))}
            </RadioGroup>
            <Field className="mt-3">
              <FieldLabel
                htmlFor="date-from"
                className="text-xs font-normal tracking-normal text-muted-foreground normal-case"
              >
                Custom Range
              </FieldLabel>
              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                <Input id="date-from" type="date" aria-label="From date" />
                <span className="text-muted-foreground" aria-hidden>
                  —
                </span>
                <Input id="date-to" type="date" aria-label="To date" />
              </div>
            </Field>
          </FieldSet>
          <FieldSet>
            <FieldLegend>File Size</FieldLegend>
            <Separator className="-mt-2 mb-2" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-medium tracking-wider text-muted-foreground uppercase">
                <span>0 MB</span>
                <span>500+ MB</span>
              </div>
              <Slider defaultValue={[0, 60]} max={100} step={1} />
              <div className="flex items-center justify-between text-xs font-medium">
                <span>Min: 0 MB</span>
                <span>Max: 300 MB</span>
              </div>
            </div>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Tags</FieldLegend>
            <Separator className="-mt-2 mb-2" />
            <Field>
              <Input placeholder="Filter by tag..." />
              <FieldDescription>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {TAGS.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </FieldDescription>
            </Field>
          </FieldSet>
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex gap-2 border-t pt-6">
        <Button
          variant="outline"
          className="flex-1 bg-background hover:bg-background/80"
        >
          Reset
        </Button>
        <Button className="flex-1">Apply Filters</Button>
      </CardFooter>
    </Card>
  )
}
