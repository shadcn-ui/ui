"use client"

import { Badge } from "@/registry/bases/radix/ui/badge"
import { Card, CardContent } from "@/registry/bases/radix/ui/card"
import { Checkbox } from "@/registry/bases/radix/ui/checkbox"
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
} from "@/registry/bases/radix/ui/field"
import { Input } from "@/registry/bases/radix/ui/input"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/bases/radix/ui/radio-group"
import { Switch } from "@/registry/bases/radix/ui/switch"
import { Textarea } from "@/registry/bases/radix/ui/textarea"
import { CanvaFrame } from "@/app/(design)/design/components/canva"

export default function FieldDemo() {
  return (
    <CanvaFrame>
      <div className="@container w-full">
        <div className="bg-muted grid gap-4 p-4 @3xl:grid-cols-2 @5xl:grid-cols-3 @[120rem]:grid-cols-4 @[140rem]:grid-cols-5">
          <div className="flex flex-col gap-6">
            <BasicFields />
          </div>
        </div>
      </div>
    </CanvaFrame>
  )
}

function BasicFields() {
  return (
    <Card>
      <CardContent>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name-x8k">Name</FieldLabel>
              <FieldDescription>
                Enter your name so it is long enough to test the layout.
              </FieldDescription>
              <Input id="name-x8k" type="text" />
            </Field>
            <Field>
              <FieldLabel htmlFor="message-x8k">Message</FieldLabel>
              <FieldDescription>
                Enter your message so it is long enough to test the layout.
              </FieldDescription>
              <Textarea id="message-x8k" placeholder="Enter your message" />
            </Field>
            <Field>
              <FieldLabel htmlFor="message-x28k">Message</FieldLabel>
              <Textarea id="message-x28k" placeholder="Enter your message" />
              <FieldDescription>
                Enter your message so it is long enough to test the layout.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="name-2-p9m">
                Name{" "}
                <Badge variant="secondary" className="ml-auto">
                  Recommended
                </Badge>
              </FieldLabel>
              <Input id="name-2-p9m" type="text" />
              <FieldDescription>
                Enter your name so it is long enough to test the layout.
              </FieldDescription>
            </Field>
            <FieldSeparator />
            <Field orientation="horizontal">
              <Checkbox id="terms-21f-q7r" />
              <FieldLabel htmlFor="terms-21f-q7r">
                Accept terms and conditions
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="terms-21f-w4t">
                Accept terms and conditions
              </FieldLabel>
              <Checkbox id="terms-21f-w4t" />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="dark-mode-b5n">Dark Mode</FieldLabel>
              <Switch id="dark-mode-b5n" />
            </Field>
            <RadioGroup>
              <Field orientation="horizontal">
                <FieldLabel htmlFor="dark-mode-22-f3j">Dark Mode</FieldLabel>
                <RadioGroupItem value="dark-mode-22" id="dark-mode-22-f3j" />
              </Field>
            </RadioGroup>
            <FieldSeparator />
            <Field orientation="horizontal">
              <Checkbox id="enable-touch-id-m8v" />
              <FieldContent>
                <FieldLabel htmlFor="enable-touch-id-m8v">
                  Enable Touch ID
                </FieldLabel>
                <FieldDescription>
                  Enable Touch ID to quickly unlock your device.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="enable-touch-id-88v" />
              <FieldContent>
                <FieldLabel htmlFor="enable-touch-id-88v">
                  Enable Touch ID and Face ID to make it even faster to unlock
                  your device. This is a long label to test the layout.
                </FieldLabel>
                <FieldDescription>
                  Enable Touch ID to quickly unlock your device.
                </FieldDescription>
              </FieldContent>
            </Field>
            <FieldLabel htmlFor="enable-touch-id-m8x">
              <Field orientation="horizontal">
                <Checkbox id="enable-touch-id-m8x" />
                <FieldContent>
                  <FieldTitle>Enable Touch ID</FieldTitle>
                  <FieldDescription>
                    Enable Touch ID to quickly unlock your device.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="enable-touch-id-18v">
              <Field orientation="horizontal">
                <Checkbox id="enable-touch-id-18v" />
                <FieldContent>
                  <FieldTitle>
                    Enable Touch ID and Face ID to make it even faster to unlock
                    your device. This is a long label to test the layout.
                  </FieldTitle>
                  <FieldDescription>
                    Enable Touch ID to quickly unlock your device.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldLabel>
            <RadioGroup className="gap-6">
              <Field orientation="horizontal">
                <RadioGroupItem
                  value="enable-touch-id-m10v"
                  id="enable-touch-id-m10v"
                />
                <FieldContent>
                  <FieldLabel htmlFor="enable-touch-id-m10v">
                    Enable Touch ID
                  </FieldLabel>
                  <FieldDescription>
                    Enable Touch ID to quickly unlock your device.
                  </FieldDescription>
                </FieldContent>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem
                  value="enable-touch-id-m10v"
                  id="enable-touch-id-m10v"
                />
                <FieldContent>
                  <FieldLabel htmlFor="enable-touch-id-m10v">
                    Enable Touch ID and Face ID to make it even faster to unlock
                    your device. This is a long label to test the layout.
                  </FieldLabel>
                  <FieldDescription>
                    Enable Touch ID to quickly unlock your device.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </RadioGroup>
            <RadioGroup className="gap-3">
              <FieldLabel htmlFor="enable-touch-id-m2222v">
                <Field orientation="horizontal">
                  <RadioGroupItem
                    value="enable-touch-id-m2222v"
                    id="enable-touch-id-m2222v"
                  />
                  <FieldContent>
                    <FieldTitle>Enable Touch ID</FieldTitle>
                    <FieldDescription>
                      Enable Touch ID to quickly unlock your device.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="enable-touch-id-m10xx">
                <Field orientation="horizontal">
                  <RadioGroupItem
                    value="enable-touch-id-m10xx"
                    id="enable-touch-id-m10xx"
                  />
                  <FieldContent>
                    <FieldTitle>
                      Enable Touch ID and Face ID to make it even faster to
                      unlock your device. This is a long label to test the
                      layout.
                    </FieldTitle>
                    <FieldDescription>
                      Enable Touch ID to quickly unlock your device.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            </RadioGroup>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend variant="label">Battery Level</FieldLegend>
              <FieldDescription>
                Choose your preferred battery level.
              </FieldDescription>
              <RadioGroup>
                <Field orientation="horizontal">
                  <RadioGroupItem value="high" id="battery-level-high-k6p" />
                  <FieldLabel htmlFor="battery-level-high-k6p">High</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem
                    value="medium"
                    id="battery-level-medium-z9l"
                  />
                  <FieldLabel htmlFor="battery-level-medium-z9l">
                    Medium
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem value="low" id="battery-level-low-v1c" />
                  <FieldLabel htmlFor="battery-level-low-v1c">Low</FieldLabel>
                </Field>
              </RadioGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend variant="label">
                Search Results Search Results
              </FieldLegend>
              <FieldDescription>
                Only selected categories will appear in search results.
              </FieldDescription>
              <FieldGroup className="gap-3">
                <Field orientation="horizontal">
                  <Checkbox id="search-results-application-r8s" />
                  <FieldLabel htmlFor="search-results-application-r8s">
                    Application
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="search-results-music-n3w" />
                  <FieldLabel htmlFor="search-results-music-n3w">
                    Music
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="search-results-video-u7y" />
                  <FieldLabel htmlFor="search-results-video-u7y">
                    Video
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="search-results-photo-a4e" />
                  <FieldLabel htmlFor="search-results-photo-a4e">
                    Photo
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="search-results-document-i9o" />
                  <FieldLabel htmlFor="search-results-document-i9o">
                    Document
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="search-results-other-h2k" />
                  <FieldLabel htmlFor="search-results-other-h2k">
                    Other
                  </FieldLabel>
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Measurement System</FieldLegend>
              <FieldDescription>
                Select your preferred measurement system.
              </FieldDescription>
              <RadioGroup>
                <FieldLabel htmlFor="metric-l6m">
                  <Field orientation="horizontal">
                    <FieldTitle>Metric</FieldTitle>
                    <RadioGroupItem value="metric" id="metric-l6m" />
                  </Field>
                </FieldLabel>
                <FieldLabel>
                  <Field orientation="horizontal">
                    <RadioGroupItem value="imperial" id="imperial-x8j" />
                    <FieldTitle>Imperial</FieldTitle>
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="custom-units-p3v">
                  <Field orientation="horizontal">
                    <FieldTitle>Custom</FieldTitle>
                    <RadioGroupItem
                      value="custom-units"
                      id="custom-units-p3v"
                    />
                  </Field>
                </FieldLabel>
              </RadioGroup>
            </FieldSet>
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  )
}
