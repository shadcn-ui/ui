import { SunDimIcon, SunIcon } from "lucide-react"

import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Slider } from "@/registry/new-york-v4/ui/slider"
import { Switch } from "@/registry/new-york-v4/ui/switch"

export function DisplaySettings() {
  return (
    <FieldSet>
      <FieldLegend>Display</FieldLegend>
      <FieldDescription>
        Configure display settings, brightness, refresh rate, and more.
      </FieldDescription>
      <FieldGroup>
        <Field orientation="responsive">
          <FieldContent>
            <FieldLabel htmlFor="resolution">Resolution</FieldLabel>
            <FieldDescription>Select the display resolution.</FieldDescription>
          </FieldContent>
          <Select>
            <SelectTrigger id="resolution" className="ml-auto">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="1920x1080">1920 x 1080</SelectItem>
              <SelectItem value="2560x1440">2560 x 1440</SelectItem>
              <SelectItem value="3840x2160">3840 x 2160</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <FieldSeparator />
        <Field orientation="responsive">
          <FieldContent>
            <FieldTitle>Brightness</FieldTitle>
            <FieldDescription>
              Adjust the display brightness level.
            </FieldDescription>
          </FieldContent>
          <div className="flex min-w-[150px] items-center gap-2">
            <SunDimIcon className="size-4 shrink-0" />
            <Slider
              id="brightness"
              defaultValue={[75]}
              max={100}
              step={1}
              aria-label="Brightness"
            />
            <SunIcon className="size-4 shrink-0" />
          </div>
        </Field>
        <FieldSeparator />
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="auto-brightness">
              Automatically Adjust Brightness
            </FieldLabel>
            <FieldDescription>
              Automatically adjust brightness based on ambient light.
            </FieldDescription>
          </FieldContent>
          <Checkbox id="auto-brightness" defaultChecked />
        </Field>
        <FieldSeparator />
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="true-tone">True Tone</FieldLabel>
            <FieldDescription>
              Automatically adjust colors to match ambient lighting.
            </FieldDescription>
          </FieldContent>
          <Switch id="true-tone" />
        </Field>
        <FieldSeparator />
        <Field orientation="responsive">
          <FieldContent>
            <FieldLabel htmlFor="refresh-rate">Refresh Rate</FieldLabel>
            <FieldDescription>
              Select the display refresh rate.
            </FieldDescription>
          </FieldContent>
          <Select>
            <SelectTrigger id="refresh-rate" className="ml-auto min-w-[200px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="60hz">60 Hz</SelectItem>
              <SelectItem value="120hz">120 Hz</SelectItem>
              <SelectItem value="144hz">144 Hz</SelectItem>
              <SelectItem value="240hz">240 Hz</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <FieldSeparator />
        <Field orientation="responsive">
          <FieldContent>
            <FieldLabel htmlFor="tv-connection">
              When connected to TV
            </FieldLabel>
            <FieldDescription>
              Choose display behavior when connected to a TV.
            </FieldDescription>
          </FieldContent>
          <Select>
            <SelectTrigger id="tv-connection" className="ml-auto">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="mirror">Mirror Display</SelectItem>
              <SelectItem value="extend">Extend Display</SelectItem>
              <SelectItem value="tv-only">TV Only</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
