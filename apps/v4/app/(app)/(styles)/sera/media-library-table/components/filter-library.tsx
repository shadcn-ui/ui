"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon, FilterIcon, XIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "@/styles/base-sera/ui/button"
import { Calendar } from "@/styles/base-sera/ui/calendar"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/styles/base-sera/ui/card"
import { Checkbox } from "@/styles/base-sera/ui/checkbox"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/styles/base-sera/ui/combobox"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/styles/base-sera/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/styles/base-sera/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/styles/base-sera/ui/radio-group"
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

const TAGS = [
  "architecture",
  "brutalism",
  "ceramics",
  "design-week",
  "editorial",
  "exterior",
  "film",
  "food",
  "furniture",
  "interior",
  "kyoto",
  "minimalism",
  "print",
  "sustainability",
  "summer-issue",
  "video",
] as const

export function FilterLibrary() {
  const tagAnchor = useComboboxAnchor()
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: addDays(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      21
    ),
  })

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Filter Library</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>File Type</FieldLegend>
            <Field>
              {FILE_TYPES.map((type) => (
                <Field key={type.id} orientation="horizontal">
                  <Checkbox id={type.id} defaultChecked={type.defaultChecked} />
                  <FieldLabel htmlFor={type.id}>{type.label}</FieldLabel>
                </Field>
              ))}
            </Field>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Date Uploaded</FieldLegend>
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
          </FieldSet>
          <Field>
            <FieldLabel htmlFor="custom-range">Custom Range</FieldLabel>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    id="custom-range"
                    className="w-full"
                  />
                }
              >
                <CalendarIcon data-icon="inline-start" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} –{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </Field>
          <FieldSet>
            <FieldLegend>File Size</FieldLegend>
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
            <Field>
              <Combobox
                multiple
                autoHighlight
                items={TAGS}
                defaultValue={["architecture", "brutalism"]}
              >
                <ComboboxChips ref={tagAnchor}>
                  <ComboboxValue>
                    {(values) => (
                      <React.Fragment>
                        {values.map((value: string) => (
                          <ComboboxChip key={value}>{value}</ComboboxChip>
                        ))}
                        <ComboboxChipsInput placeholder="Filter by tag..." />
                      </React.Fragment>
                    )}
                  </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={tagAnchor}>
                  <ComboboxEmpty>No tags found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
          </FieldSet>
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 border-t">
        <Button className="w-full">Apply Filters</Button>
        <Button variant="ghost" className="w-full">
          Reset
        </Button>
      </CardFooter>
    </Card>
  )
}
