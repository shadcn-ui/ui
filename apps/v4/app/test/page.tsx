import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/registry/new-york-v4/ui/field"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/new-york-v4/ui/radio-group"
import { Switch } from "@/registry/new-york-v4/ui/switch"

export default function TestPage() {
  return (
    <FieldGroup>
      <Field>
        <Label htmlFor="name">Name</Label>
        <FieldDescription>
          Enter your name so it is long enough to test the layout.
        </FieldDescription>
        <Input id="name" type="text" />
      </Field>
      <Field>
        <Label htmlFor="name-2">Name</Label>
        <Input id="name-2" type="text" />
        <FieldDescription>
          Enter your name so it is long enough to test the layout.
        </FieldDescription>
      </Field>
      <Field>
        <Checkbox id="terms-21f" />
        <Label htmlFor="terms-21f">Accept terms and conditions</Label>
      </Field>
      <Field>
        <Label htmlFor="terms-21f">Accept terms and conditions</Label>
        <Checkbox id="terms-21f" />
      </Field>
      <Field>
        <Label htmlFor="dark-mode">Dark Mode</Label>
        <Switch id="dark-mode" />
      </Field>
      <RadioGroup>
        <Field>
          <Label htmlFor="dark-mode-22">Dark Mode</Label>
          <RadioGroupItem value="dark-mode-22" id="dark-mode-22" />
        </Field>
      </RadioGroup>
      <Field>
        <Label htmlFor="enable-touch-id">Enable Touch ID</Label>
        <FieldDescription>
          Enable Touch ID to quickly unlock your device.
        </FieldDescription>
        <Checkbox id="enable-touch-id" />
      </Field>
      <FieldSeparator />
      <Field>
        <Label htmlFor="battery-level">Battery Level</Label>
        <FieldDescription>
          Choose your preferred battery level.
        </FieldDescription>
        <RadioGroup>
          <Field>
            <RadioGroupItem value="high" id="battery-level-high" />
            <Label htmlFor="battery-level-high">High</Label>
          </Field>
          <Field>
            <RadioGroupItem value="medium" id="battery-level-medium" />
            <Label htmlFor="battery-level-medium">Medium</Label>
          </Field>
          <Field>
            <RadioGroupItem value="low" id="battery-level-low" />
            <Label htmlFor="battery-level-low">Low</Label>
          </Field>
        </RadioGroup>
      </Field>
      <FieldSeparator />
      <Field>
        <Label htmlFor="search-results">Search Results</Label>
        <FieldDescription>
          Only selected categories will appear in search results.
        </FieldDescription>
        <Field>
          <Checkbox id="search-results-application" />
          <Label htmlFor="search-results-application">Application</Label>
        </Field>
        <Field>
          <Checkbox id="search-results-music" />
          <Label htmlFor="search-results-music">Music</Label>
        </Field>
        <Field>
          <Checkbox id="search-results-video" />
          <Label htmlFor="search-results-video">Video</Label>
        </Field>
        <Field>
          <Checkbox id="search-results-photo" />
          <Label htmlFor="search-results-photo">Photo</Label>
        </Field>
        <Field>
          <Checkbox id="search-results-document" />
          <Label htmlFor="search-results-document">Document</Label>
        </Field>
        <Field>
          <Checkbox id="search-results-other" />
          <Label htmlFor="search-results-other">Other</Label>
        </Field>
      </Field>
    </FieldGroup>
  )
}
