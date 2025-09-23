import Image from "next/image"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/registry/new-york-v4/ui/field"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/new-york-v4/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Switch } from "@/registry/new-york-v4/ui/switch"

const modes = [
  {
    name: "Light",
    value: "light",
    image: "/placeholder.svg",
  },
  {
    name: "Dark",
    value: "dark",
    image: "/placeholder.svg",
  },
  {
    name: "System",
    value: "system",
    image: "/placeholder.svg",
  },
]

const accents = [
  {
    name: "Blue",
    value: "#007AFF",
  },
  {
    name: "Purple",
    value: "#6A4695",
  },
  {
    name: "Red",
    value: "#FF3B30",
  },
  {
    name: "Orange",
    value: "#FF9500",
  },
]

export function AppearanceSettings() {
  return (
    <FieldSet>
      <FieldLegend>Appearance</FieldLegend>
      <FieldDescription>
        Configure appearance. accent, scroll bar, and more.
      </FieldDescription>
      <FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">Mode</FieldLegend>
          <FieldDescription>
            Select the mode to use for the appearance.
          </FieldDescription>
          <RadioGroup
            className="flex flex-col gap-4 lg:grid lg:grid-cols-3"
            defaultValue="light"
          >
            {modes.map((mode) => (
              <FieldLabel
                htmlFor={mode.value}
                className="gap-0 overflow-hidden"
                key={mode.value}
              >
                <Image
                  src={mode.image}
                  alt={mode.name}
                  width={160}
                  height={90}
                  className="hidden aspect-video object-cover md:block dark:brightness-[0.2] dark:grayscale"
                />
                <Field orientation="horizontal">
                  <FieldTitle>{mode.name}</FieldTitle>
                  <RadioGroupItem id={mode.value} value={mode.value} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </FieldSet>
        <FieldSeparator />
        <Field orientation="responsive">
          <FieldContent>
            <FieldTitle>Accent</FieldTitle>
            <FieldDescription>
              Select the accent color to use for the appearance.
            </FieldDescription>
          </FieldContent>
          <FieldSet aria-label="Accent">
            <RadioGroup className="flex flex-wrap gap-2" defaultValue="#007AFF">
              {accents.map((accent) => (
                <Label
                  htmlFor={accent.value}
                  key={accent.value}
                  className="size-6 rounded-full"
                  style={{ backgroundColor: accent.value }}
                >
                  <Field>
                    <FieldTitle className="sr-only">{accent.name}</FieldTitle>
                    <RadioGroupItem
                      id={accent.value}
                      value={accent.value}
                      aria-label={accent.name}
                      className="size-6 border-none [&_svg]:size-3 [&_svg]:fill-white [&_svg]:stroke-white"
                    />
                  </Field>
                </Label>
              ))}
            </RadioGroup>
          </FieldSet>
        </Field>
        <FieldSeparator />
        <Field orientation="responsive">
          <FieldContent>
            <FieldLabel htmlFor="icon-size">Sidebar Icon Size</FieldLabel>
            <FieldDescription>
              Select the size of the sidebar icons.
            </FieldDescription>
          </FieldContent>
          <Select>
            <SelectTrigger id="icon-size" className="ml-auto">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <FieldSeparator />
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="tinting">Wallpaper Tinting</FieldLabel>
            <FieldDescription>
              Allow the wallpaper to be tinted with the accent color.
            </FieldDescription>
          </FieldContent>
          <Switch id="tinting" defaultChecked />
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
