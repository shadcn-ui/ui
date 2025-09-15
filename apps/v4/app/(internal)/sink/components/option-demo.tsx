import Image from "next/image"

import { Card, CardContent } from "@/registry/new-york-v4/ui/card"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldTitle,
} from "@/registry/new-york-v4/ui/field"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  Option,
  OptionCover,
  OptionDescription,
  OptionField,
  OptionGroup,
  OptionTitle,
} from "@/registry/new-york-v4/ui/option"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/new-york-v4/ui/radio-group"
import { Switch } from "@/registry/new-york-v4/ui/switch"

export function OptionDemo() {
  return (
    <div className="bg-muted flex flex-wrap items-start gap-5 p-4 *:[div]:w-md">
      <div className="flex flex-col gap-6">
        <OptionRadioDemo />
        <OptionMoreRadioDemo />
      </div>
      <div className="flex flex-col gap-6">
        <OptionRadioImageDemo />
        <OptionCheckboxDemo />
      </div>
    </div>
  )
}

function OptionRadioImageDemo() {
  return (
    <Card>
      <CardContent>
        <FieldGroup>
          <Field>
            <Label>Theme Preferences</Label>
            <FieldDescription>
              Select your preferred theme preferences.
            </FieldDescription>
            <Option htmlFor="true-tone">
              <Field orientation="horizontal">
                <Field>
                  <FieldTitle>True Tone</FieldTitle>
                  <FieldDescription>
                    Automatically adjusts the color temperature to match the
                    ambient light.
                  </FieldDescription>
                </Field>
                <Switch id="true-tone" />
              </Field>
            </Option>
            <RadioGroup>
              <Option htmlFor="light">
                <Image
                  src="/placeholder.svg"
                  alt="Light"
                  width={256}
                  height={128}
                  className="aspect-video w-full object-cover"
                />
                <Field orientation="horizontal">
                  <FieldTitle>Light</FieldTitle>
                  <FieldDescription>
                    A light theme with a bright background and dark text.
                  </FieldDescription>
                  <RadioGroupItem value="light" id="light" />
                </Field>
              </Option>
              <Option htmlFor="dark">
                <OptionCover>
                  <Image
                    src="/placeholder.svg"
                    alt="Light"
                    width={256}
                    height={128}
                    className="aspect-video w-full object-cover"
                  />
                </OptionCover>
                <OptionField>
                  <OptionTitle>Dark</OptionTitle>
                  <OptionDescription>
                    A dark theme with a dark background and light text.
                  </OptionDescription>
                </OptionField>
                <RadioGroupItem value="dark" id="dark" />
              </Option>
              <Option htmlFor="custom-theme">
                <OptionCover>
                  <Image
                    src="/placeholder.svg"
                    alt="Light"
                    width={256}
                    height={128}
                    className="aspect-video w-full object-cover"
                  />
                </OptionCover>
                <OptionField>
                  <OptionTitle>Custom Theme</OptionTitle>
                  <OptionDescription>
                    A custom theme with a custom background and custom text.
                  </OptionDescription>
                </OptionField>
                <RadioGroupItem value="custom-theme" id="custom-theme" />
              </Option>
            </RadioGroup>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

function OptionRadioDemo() {
  return (
    <Card>
      <CardContent>
        <FieldGroup>
          <Field>
            <Label>Measurement System</Label>
            <FieldDescription>
              Select your preferred measurement system.
            </FieldDescription>
            <RadioGroup>
              <Option htmlFor="metric">
                <Field orientation="horizontal">
                  <FieldTitle>Metric</FieldTitle>
                  <RadioGroupItem value="metric" id="metric" />
                </Field>
              </Option>
              <Field orientation="horizontal">
                <RadioGroupItem value="imperial" id="imperial" />
                <Label htmlFor="imperial">Imperial</Label>
              </Field>
              <Option htmlFor="custom-units">
                <Field orientation="horizontal">
                  <FieldTitle>Custom</FieldTitle>
                  <RadioGroupItem value="custom-units" id="custom-units" />
                </Field>
              </Option>
            </RadioGroup>
          </Field>
          <Field>
            <Label>Display Resolution</Label>
            <FieldDescription>
              Select your preferred display resolution.
            </FieldDescription>
            <RadioGroup className="grid grid-cols-2 gap-2">
              <Option htmlFor="1080p">
                <RadioGroupItem value="1080p" id="1080p" />
                <OptionTitle>1920x1080</OptionTitle>
              </Option>
              <Option htmlFor="1440p">
                <RadioGroupItem value="1440p" id="1440p" />
                <OptionTitle>2560x1440</OptionTitle>
              </Option>
              <Option htmlFor="4k">
                <RadioGroupItem value="4k" id="4k" />
                <OptionTitle>3840x2160</OptionTitle>
                <OptionDescription>
                  This is a description for the 4k option.
                </OptionDescription>
              </Option>
              <Option htmlFor="8k">
                <OptionTitle>7680x4320</OptionTitle>
                <RadioGroupItem value="8k" id="8k" />
              </Option>
            </RadioGroup>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

function OptionMoreRadioDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <FieldGroup>
            <Field>
              <Label>Subscription Plan</Label>
              <FieldDescription>
                Choose your subscription plan.
              </FieldDescription>
              <RadioGroup defaultValue="plus">
                <Option htmlFor="plus">
                  <OptionField>
                    <OptionTitle>Plus</OptionTitle>
                    <OptionDescription>
                      For individuals and small teams
                    </OptionDescription>
                  </OptionField>
                  <RadioGroupItem value="plus" id="plus" />
                </Option>
                <Option htmlFor="pro">
                  <OptionField>
                    <OptionTitle>Pro</OptionTitle>
                    <OptionDescription>
                      For individuals and small teams
                    </OptionDescription>
                  </OptionField>
                  <RadioGroupItem value="pro" id="pro" />
                </Option>
                <Option htmlFor="enterprise">
                  <OptionField>
                    <OptionTitle>Enterprise</OptionTitle>
                    <OptionDescription>
                      For large teams and enterprises
                    </OptionDescription>
                  </OptionField>
                  <RadioGroupItem value="enterprise" id="enterprise" />
                </Option>
                <Option htmlFor="custom-plan">
                  <OptionField>
                    <OptionTitle>Custom</OptionTitle>
                    <OptionDescription>
                      For large teams and enterprises
                    </OptionDescription>
                  </OptionField>
                  <RadioGroupItem value="custom-plan" id="custom-plan" />
                </Option>
              </RadioGroup>
            </Field>
            <Field>
              <Label>Display Settings</Label>
              <FieldDescription>Manage your display settings.</FieldDescription>
              <OptionGroup>
                <Option htmlFor="increase-contrast">
                  <OptionField>
                    <OptionTitle>Increase Contrast</OptionTitle>
                    <OptionDescription>
                      Increase the contrast of the UI to make it easier to read.
                    </OptionDescription>
                  </OptionField>
                  <Switch id="increase-contrast" />
                </Option>
                <Option htmlFor="reduce-transparency">
                  <OptionField>
                    <OptionTitle>Reduce Transparency</OptionTitle>
                    <OptionDescription>
                      Reduce the transparency of the UI to make it easier to
                      read.
                    </OptionDescription>
                  </OptionField>
                  <Switch id="reduce-transparency" />
                </Option>
                <Option htmlFor="reduce-motion">
                  <OptionField>
                    <OptionTitle>Reduce Motion</OptionTitle>
                    <OptionDescription>
                      Reduce the motion of the UI to make it easier to read.
                    </OptionDescription>
                  </OptionField>
                  <Switch id="reduce-motion" />
                </Option>
                <Option htmlFor="enable-dark-mode">
                  <OptionField>
                    <OptionTitle>Enable Dark Mode</OptionTitle>
                    <OptionDescription>
                      Enable dark mode to make the UI easier to read.
                    </OptionDescription>
                  </OptionField>
                  <Switch id="enable-dark-mode" />
                </Option>
              </OptionGroup>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}

function OptionCheckboxDemo() {
  return (
    <Card>
      <CardContent>
        <Field>
          <Label>Enable iCloud Sync</Label>
          <FieldDescription>
            Optimize your storage and enable iCloud Sync.
          </FieldDescription>
          <OptionGroup>
            <Option htmlFor="storage">
              <OptionField>
                <OptionTitle>Optimize Storage</OptionTitle>
                <OptionDescription>
                  Optimize your storage by deleting unused data.
                </OptionDescription>
              </OptionField>
              <Checkbox id="storage" defaultChecked />
            </Option>
            <Option htmlFor="icloud-sync">
              <OptionField>
                <OptionTitle>Enable iCloud Sync</OptionTitle>
                <OptionDescription>
                  Enable iCloud Sync to sync your data across all your devices.
                </OptionDescription>
              </OptionField>
              <Checkbox id="icloud-sync" />
            </Option>
            <Option htmlFor="empty-trash">
              <OptionField>
                <OptionTitle>Empty Trash Automatically</OptionTitle>
                <OptionDescription>
                  Save space by automatically erasing unused data that have been
                  deleted for more than 30 days.
                </OptionDescription>
              </OptionField>
              <Checkbox id="empty-trash" disabled />
            </Option>
            <Option htmlFor="invalid-option">
              <OptionField>
                <OptionTitle>Delete Unused Data</OptionTitle>
                <OptionDescription>
                  Delete unused data to free up space.
                </OptionDescription>
              </OptionField>
              <Checkbox id="invalid-option" aria-invalid />
            </Option>
          </OptionGroup>
        </Field>
      </CardContent>
    </Card>
  )
}
