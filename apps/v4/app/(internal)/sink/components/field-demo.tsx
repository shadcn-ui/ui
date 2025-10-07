"use client"

import { useState } from "react"
import {
  IconCircle,
  IconCircleCheckFilled,
  IconInfoCircle,
  IconMinus,
  IconPlus,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react"
import { addDays, format } from "date-fns"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import {
  CalendarIcon,
  ClockIcon,
  DownloadIcon,
  FileTextIcon,
  FolderIcon,
  MonitorIcon,
} from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york-v4/ui/avatar"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"
import { ButtonGroup } from "@/registry/new-york-v4/ui/button-group"
import { Calendar } from "@/registry/new-york-v4/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
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
import { Input } from "@/registry/new-york-v4/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/new-york-v4/ui/input-group"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/registry/new-york-v4/ui/input-otp"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
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
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { Slider } from "@/registry/new-york-v4/ui/slider"
import { Switch } from "@/registry/new-york-v4/ui/switch"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/new-york-v4/ui/toggle-group"

export function FieldDemo() {
  return (
    <div className="@container w-full">
      <div className="bg-muted grid gap-4 p-4 @3xl:grid-cols-2 @5xl:grid-cols-3 @[120rem]:grid-cols-4 @[140rem]:grid-cols-5">
        <div className="flex flex-col gap-6">
          <BasicFields />
          <PrivacySettings />
          <HearAboutUs />
          <ClusterConfig />
          <ShippingMethods />
        </div>
        <div className="flex flex-col gap-6">
          <SubscriptionPlan />
          <FormInputDemo />
          <FormInputTypesDemo />
          <FeedbackForm />
          <JobApplicationForm />
          <FormDatePickerDemo />
          <LoginForm />
        </div>
        <div className="flex flex-col gap-6">
          <FormSpecialInputTypesDemo />
          <FormTextareaDemo />
          <FormSelectDemo />
          <ProfileSettingsForm />
          <FormFieldGroupOutlineDemo />
          <SurveyForm />
          <SignupForm />
        </div>
        <div className="flex flex-col gap-6">
          <FormRadioDemo />
          <FormCheckboxDemo />
          <FormSliderDemo />
          <NewsletterForm />
          <PaymentForm />
          <ContactForm />
          <ComplexFormDemo />
          <ComplexFormInvalidDemo />
        </div>
        <div className="flex flex-col gap-6">
          <CheckoutForm />
          <FormSwitchDemo />
          <FormToggleGroupDemo />
          <FormOTPDemo />
          <FormFieldSetDemo />
          <FormFieldSeparatorDemo />
          <FinderPreferencesForm />
        </div>
        <div className="flex flex-col gap-6"></div>
      </div>
    </div>
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

function SubscriptionPlan() {
  return (
    <Card>
      <CardContent>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Subscription Plan</FieldLegend>
            <FieldDescription>Choose your subscription plan.</FieldDescription>
            <RadioGroup defaultValue="plus">
              <FieldLabel htmlFor="plus-g4s">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Plus</FieldTitle>
                    <FieldDescription>
                      For individuals and small teams
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="plus" id="plus-g4s" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="pro-m9d">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Pro</FieldTitle>
                    <FieldDescription>
                      For individuals and small teams
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="pro" id="pro-m9d" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="enterprise-k7w">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Enterprise</FieldTitle>
                    <FieldDescription>
                      For large teams and enterprises
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="enterprise" id="enterprise-k7w" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="custom-plan-r3t">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Custom</FieldTitle>
                    <FieldDescription>
                      For large teams and enterprises
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="custom-plan" id="custom-plan-r3t" />
                </Field>
              </FieldLabel>
            </RadioGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Display Settings</FieldLegend>
            <FieldDescription>Manage your display settings.</FieldDescription>
            <Field>
              <FieldLabel htmlFor="increase-contrast-b8h">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Increase Contrast</FieldTitle>
                    <FieldDescription>
                      Increase the contrast of the UI to make it easier to read.
                    </FieldDescription>
                  </FieldContent>
                  <Switch id="increase-contrast-b8h" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="reduce-transparency-v5l">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Reduce Transparency</FieldTitle>
                    <FieldDescription>
                      Reduce the transparency of the UI to make it easier to
                      read.
                    </FieldDescription>
                  </FieldContent>
                  <Switch id="reduce-transparency-v5l" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="reduce-motion-n2j">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Reduce Motion</FieldTitle>
                    <FieldDescription>
                      Reduce motion of the UI to make it easier to read.
                    </FieldDescription>
                  </FieldContent>
                  <Switch id="reduce-motion-n2j" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="enable-dark-mode-w6q">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Enable Dark Mode</FieldTitle>
                    <FieldDescription>
                      Enable dark mode to make the UI easier to read.
                    </FieldDescription>
                  </FieldContent>
                  <Switch id="enable-dark-mode-w6q" />
                </Field>
              </FieldLabel>
            </Field>
            <FieldSet>
              <FieldLegend>Display Resolution</FieldLegend>
              <FieldDescription>
                Select your preferred display resolution.
              </FieldDescription>
              <RadioGroup className="grid grid-cols-2 gap-2">
                <FieldLabel htmlFor="1080p-z4c">
                  <Field orientation="horizontal">
                    <RadioGroupItem value="1080p" id="1080p-z4c" />
                    <FieldTitle>1920x1080</FieldTitle>
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="1440p-x7y">
                  <Field orientation="horizontal">
                    <RadioGroupItem value="1440p" id="1440p-x7y" />
                    <FieldTitle>2560x1440</FieldTitle>
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="4k-p1v">
                  <Field orientation="horizontal">
                    <RadioGroupItem value="4k" id="4k-p1v" />
                    <FieldTitle>3840x2160</FieldTitle>
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="8k-u9e">
                  <Field orientation="horizontal">
                    <RadioGroupItem value="8k" id="8k-u9e" />
                    <FieldTitle>7680x4320</FieldTitle>
                  </Field>
                </FieldLabel>
              </RadioGroup>
            </FieldSet>
          </FieldSet>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

function PrivacySettings() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>
            Choose who can see your profile and what they can see.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup>
            <FieldLabel htmlFor="everyone-f8k">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>
                    Everyone <Badge className="rounded-full">Default</Badge>
                  </FieldTitle>
                  <FieldDescription>
                    Anyone can see your profile.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value="everyone"
                  id="everyone-f8k"
                  className="sr-only"
                />
                <IconCircle className="stroke-input size-5 stroke-1 group-has-data-[state=checked]/field:hidden" />
                <IconCircleCheckFilled className="fill-primary hidden size-5 group-has-data-[state=checked]/field:block" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="followers-s7m">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Followers</FieldTitle>
                  <FieldDescription>
                    Visible to your followers and connections.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value="followers"
                  id="followers-s7m"
                  className="sr-only"
                />
                <IconCircle className="stroke-input size-5 stroke-1 group-has-data-[state=checked]/field:hidden" />
                <IconCircleCheckFilled className="fill-primary hidden size-5 group-has-data-[state=checked]/field:block" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="custom-q3r">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Custom</FieldTitle>
                  <FieldDescription>
                    Choose who can see your profile.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value="custom"
                  id="custom-q3r"
                  className="sr-only"
                />
                <IconCircle className="stroke-input size-5 stroke-1 group-has-data-[state=checked]/field:hidden" />
                <IconCircleCheckFilled className="fill-primary hidden size-5 group-has-data-[state=checked]/field:block" />
              </Field>
            </FieldLabel>
          </RadioGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>
            Choose who can see your profile and what they can see.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup>
            <FieldLabel htmlFor="everyone-b9p">
              <Field orientation="horizontal">
                <RadioGroupItem value="everyone" id="everyone-b9p" />
                <FieldContent>
                  <FieldTitle>Everyone</FieldTitle>
                  <FieldDescription>
                    Anyone can see your profile.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="followers-v3n">
              <Field orientation="horizontal">
                <RadioGroupItem value="followers" id="followers-v3n" />
                <FieldContent>
                  <FieldTitle>Followers</FieldTitle>
                  <FieldDescription>
                    Visible to your followers and connections.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="custom-t8v">
              <Field orientation="horizontal">
                <RadioGroupItem value="custom" id="custom-t8v" />
                <FieldContent>
                  <FieldTitle>Custom</FieldTitle>
                  <FieldDescription>
                    Choose who can see your profile.
                  </FieldDescription>
                </FieldContent>
                <Button variant="outline" className="w-fit">
                  Choose
                </Button>
              </Field>
            </FieldLabel>
          </RadioGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>
            Choose who can see your profile and what they can see.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup>
            <FieldLabel htmlFor="everyone-3-k4p">
              <Field orientation="horizontal">
                <div className="bg-muted group-has-data-[state=checked]/field:bg-primary group-has-data-[state=checked]/field:text-primary-foreground group-has-data-[state=checked]/field:border-primary flex size-8 shrink-0 items-center justify-center rounded-full border transition-all duration-100">
                  <IconWorld className="size-4" />
                </div>
                <FieldContent>
                  <FieldTitle>Everyone</FieldTitle>
                  <FieldDescription>
                    Anyone can see your profile.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value="everyone"
                  id="everyone-3-k4p"
                  className="sr-only"
                />
                <IconCircle className="stroke-input size-5 stroke-1 group-has-data-[state=checked]/field:hidden" />
                <IconCircleCheckFilled className="fill-primary hidden size-5 group-has-data-[state=checked]/field:block" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="followers-3-m7j">
              <Field orientation="horizontal">
                <div className="bg-muted group-has-data-[state=checked]/field:bg-primary group-has-data-[state=checked]/field:text-primary-foreground group-has-data-[state=checked]/field:border-primary flex size-8 shrink-0 items-center justify-center rounded-full border transition-all duration-100">
                  <IconUsers className="size-4" />
                </div>
                <FieldContent>
                  <FieldTitle>Followers</FieldTitle>
                  <FieldDescription>
                    Visible to your followers and connections.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value="followers-3"
                  id="followers-3-m7j"
                  className="sr-only"
                />
                <IconCircle className="stroke-input size-5 stroke-1 group-has-data-[state=checked]/field:hidden" />
                <IconCircleCheckFilled className="fill-primary hidden size-5 group-has-data-[state=checked]/field:block" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="custom-3-r9w">
              <Field orientation="horizontal">
                <div className="bg-muted group-has-data-[state=checked]/field:bg-primary group-has-data-[state=checked]/field:text-primary-foreground group-has-data-[state=checked]/field:border-primary flex size-8 shrink-0 items-center justify-center rounded-full border transition-all duration-100">
                  <IconPlus className="size-4" />
                </div>
                <FieldContent>
                  <FieldTitle>Custom</FieldTitle>
                  <FieldDescription>
                    Choose who can see your profile.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value="custom-3"
                  id="custom-3-r9w"
                  className="sr-only"
                />
                <IconCircle className="stroke-input size-5 stroke-1 group-has-data-[state=checked]/field:hidden" />
                <IconCircleCheckFilled className="fill-primary hidden size-5 group-has-data-[state=checked]/field:block" />
              </Field>
            </FieldLabel>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  )
}

function HearAboutUs() {
  return (
    <Card>
      <CardContent>
        <form>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>How did you hear about us?</FieldLegend>
              <FieldDescription>
                Select the option that best describes how you heard about us.
              </FieldDescription>
              <FieldGroup className="flex flex-row flex-wrap gap-2 [--radius:9999rem] **:data-[slot=checkbox]:rounded-full **:data-[slot=field]:gap-2 **:data-[slot=field]:overflow-hidden **:data-[slot=field]:px-2.5 **:data-[slot=field]:py-2 *:data-[slot=field-label]:w-fit">
                <FieldLabel htmlFor="social-media-b2s">
                  <Field orientation="horizontal">
                    <Checkbox
                      value="social-media"
                      id="social-media-b2s"
                      className="-ml-6 -translate-x-1 transition-all duration-100 group-has-data-[state=checked]/field-label:ml-0 group-has-data-[state=checked]/field-label:translate-x-0"
                    />
                    <FieldTitle>Social Media</FieldTitle>
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="search-engine-f6h">
                  <Field orientation="horizontal">
                    <Checkbox
                      value="search-engine"
                      id="search-engine-f6h"
                      className="-ml-6 -translate-x-1 transition-all duration-100 group-has-data-[state=checked]/field-label:ml-0 group-has-data-[state=checked]/field-label:translate-x-0"
                    />
                    <FieldTitle>Search Engine</FieldTitle>
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="referral-l3n">
                  <Field orientation="horizontal">
                    <Checkbox
                      value="referral"
                      id="referral-l3n"
                      className="-ml-6 -translate-x-1 transition-all duration-100 group-has-data-[state=checked]/field-label:ml-0 group-has-data-[state=checked]/field-label:translate-x-0"
                    />
                    <FieldTitle>Referral</FieldTitle>
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="other-u5c">
                  <Field orientation="horizontal">
                    <Checkbox
                      value="other"
                      id="other-u5c"
                      className="-ml-6 -translate-x-1 transition-all duration-100 group-has-data-[state=checked]/field-label:ml-0 group-has-data-[state=checked]/field-label:translate-x-0"
                    />
                    <FieldTitle>Other (Please specify)</FieldTitle>
                  </Field>
                </FieldLabel>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

function ClusterConfig() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buy your cluster</CardTitle>
        <CardDescription>
          Need a custom setup? <a href="#">Contact us</a>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>GPU Type</FieldLegend>
              <FieldDescription>
                Select the GPU type for your cluster.
              </FieldDescription>
              <RadioGroup defaultValue="h100">
                <FieldLabel htmlFor="h100-k9s">
                  <Field orientation="horizontal">
                    <RadioGroupItem value="h100" id="h100-k9s" />
                    <FieldContent>
                      <FieldTitle>NVIDIA H100</FieldTitle>
                      <FieldDescription>SXM5 80GB VRAM</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="h200-m3v">
                  <Field orientation="horizontal">
                    <RadioGroupItem value="h200" id="h200-m3v" />
                    <FieldContent>
                      <FieldTitle>NVIDIA H200</FieldTitle>
                      <FieldDescription>SXM5 141GB VRAM</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              </RadioGroup>
            </FieldSet>
            <Field>
              <FieldLabel htmlFor="compute-environment-p8w">
                Compute Environment
              </FieldLabel>
              <RadioGroup defaultValue="kubernetes">
                <FieldLabel htmlFor="kubernetes-r2h">
                  <Field orientation="horizontal">
                    <RadioGroupItem value="kubernetes" id="kubernetes-r2h" />
                    <FieldContent>
                      <FieldTitle>Kubernetes</FieldTitle>
                      <FieldDescription>
                        Run GPU workloads on a K8s configured cluster.
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="vm-z4k">
                  <Field orientation="horizontal">
                    <RadioGroupItem value="vm" id="vm-z4k" />
                    <FieldContent>
                      <FieldTitle>Virtual Machine</FieldTitle>
                      <FieldDescription>
                        Access a VM configured cluster via SSH to run GPU
                        workloads.
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              </RadioGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="number-of-gpus-f6l">
                Number of GPUs
              </FieldLabel>
              <FieldDescription>
                Buy a single node with 8 GPUs or many interconnected nodes. You
                can add more GPUs later.
              </FieldDescription>
              <ButtonGroup>
                <Input />
                <Button variant="outline" size="icon">
                  <IconMinus />
                </Button>
                <Button variant="outline" size="icon">
                  <IconPlus />
                </Button>
              </ButtonGroup>
            </Field>
            <FieldSet>
              <FieldLegend>Starting date</FieldLegend>
              <RadioGroup defaultValue="today">
                <FieldLabel htmlFor="today-n7t">
                  <Field orientation="horizontal">
                    <RadioGroupItem value="today" id="today-n7t" />
                    <FieldContent>
                      <FieldTitle>Start cluster now</FieldTitle>
                      <FieldDescription>
                        Your cluster will be ready to use immediately.
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="scheduled-u5j">
                  <Field orientation="horizontal">
                    <RadioGroupItem value="scheduled" id="scheduled-u5j" />
                    <FieldContent>
                      <FieldTitle>Schedule a start date and time</FieldTitle>
                      <FieldDescription>
                        Set a start date and time for your cluster.
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              </RadioGroup>
            </FieldSet>
            <Field>
              <FieldLabel htmlFor="duration-b9p">Duration</FieldLabel>
              <FieldDescription>You can add more time later.</FieldDescription>
              <ButtonGroup>
                <Input />
                <Select defaultValue="hours">
                  <SelectTrigger id="duration-b9p" className="w-24">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                  </SelectContent>
                </Select>
              </ButtonGroup>
            </Field>
            <Field orientation="horizontal">
              <Button type="submit">Get Instant Quote</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

function ShippingMethods() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <FieldSet>
            <FieldLegend>Shipping Method</FieldLegend>
            <FieldDescription>
              Select the shipping method for your order.
            </FieldDescription>
            <RadioGroup>
              <FieldLabel htmlFor="pickup-x8m">
                <Field orientation="horizontal">
                  <RadioGroupItem value="pickup" id="pickup-x8m" />
                  <FieldContent>
                    <FieldTitle>
                      Pick up your order at a nearby store
                    </FieldTitle>
                    <FieldDescription>
                      Available at most stores.
                    </FieldDescription>
                  </FieldContent>
                  <Badge
                    variant="secondary"
                    className="group-has-data-[state=checked]/field-label:bg-primary group-has-data-[state=checked]/field-label:text-primary-foreground"
                  >
                    Free
                  </Badge>
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="delivery-v3s">
                <Field orientation="horizontal">
                  <RadioGroupItem value="delivery" id="delivery-v3s" />
                  <FieldContent>
                    <FieldTitle>Delivery to your door</FieldTitle>
                    <FieldDescription>
                      We will deliver your order to your door.
                    </FieldDescription>
                  </FieldContent>
                  <Badge
                    variant="secondary"
                    className="group-has-data-[state=checked]/field-label:bg-primary group-has-data-[state=checked]/field-label:text-primary-foreground"
                  >
                    $10.00
                  </Badge>
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="express-l7r">
                <Field orientation="horizontal">
                  <RadioGroupItem value="express" id="express-l7r" />
                  <FieldContent>
                    <FieldTitle>Express delivery</FieldTitle>
                    <FieldDescription>
                      Next day delivery. Available in most areas.
                    </FieldDescription>
                  </FieldContent>
                  <Badge
                    variant="secondary"
                    className="group-has-data-[state=checked]/field-label:bg-primary group-has-data-[state=checked]/field-label:text-primary-foreground"
                  >
                    $15.00
                  </Badge>
                </Field>
              </FieldLabel>
            </RadioGroup>
          </FieldSet>
        </CardContent>
      </Card>
      <form>
        <FieldGroup className="bg-background gap-6 rounded-lg border p-6">
          <FieldSet>
            <FieldLegend>GPU Type</FieldLegend>
            <FieldDescription>
              Select the GPU type for your cluster.
            </FieldDescription>
            <RadioGroup defaultValue="h100">
              <FieldLabel htmlFor="h100-v00">
                <Field orientation="horizontal">
                  <RadioGroupItem value="h100" id="h100-v00" />
                  <FieldContent>
                    <FieldTitle>NVIDIA H100</FieldTitle>
                    <FieldDescription>SXM5 80GB VRAM</FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="h200-n86">
                <Field orientation="horizontal">
                  <RadioGroupItem value="h200" id="h200-n86" />
                  <FieldContent>
                    <FieldTitle>NVIDIA H200</FieldTitle>
                    <FieldDescription>SXM5 141GB VRAM</FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            </RadioGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>Compute Environment</FieldLegend>
            <FieldDescription>
              Select the compute environment for your cluster.
            </FieldDescription>
            <RadioGroup defaultValue="kubernetes">
              <FieldLabel htmlFor="kubernetes-dtv">
                <Field orientation="horizontal">
                  <RadioGroupItem value="kubernetes" id="kubernetes-dtv" />
                  <FieldContent>
                    <FieldTitle>Kubernetes</FieldTitle>
                    <FieldDescription>
                      Run GPU workloads on a K8s configured cluster.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="vm-8rk">
                <Field orientation="horizontal">
                  <RadioGroupItem value="vm" id="vm-8rk" />
                  <FieldContent>
                    <FieldTitle>Virtual Machine</FieldTitle>
                    <FieldDescription>
                      Access a VM configured cluster via SSH to run GPU
                      workloads.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            </RadioGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>Starting date</FieldLegend>
            <FieldDescription>
              When you want to start your cluster.
            </FieldDescription>
            <RadioGroup defaultValue="today">
              <FieldLabel htmlFor="today-pmd">
                <Field orientation="horizontal">
                  <RadioGroupItem value="today" id="today-pmd" />
                  <FieldContent>
                    <FieldTitle>Start cluster now</FieldTitle>
                    <FieldDescription>
                      Your cluster will be ready to use immediately.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="scheduled-tc9">
                <Field orientation="horizontal">
                  <RadioGroupItem value="scheduled" id="scheduled-tc9" />
                  <FieldContent>
                    <FieldTitle>Schedule a start date and time</FieldTitle>
                    <FieldDescription>
                      Set a start date and time for your cluster.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            </RadioGroup>
          </FieldSet>
          <Field>
            <Button type="submit">Get Instant Quote</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}

function SignupForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="signup-name-us1">Full Name</FieldLabel>
              <Input
                id="signup-name-us1"
                type="text"
                placeholder="John Doe"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="signup-email-zvy">Email</FieldLabel>
              <Input
                id="signup-email-zvy"
                type="email"
                placeholder="m@example.com"
                required
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="signup-password-rh7">Password</FieldLabel>
              <Input id="signup-password-rh7" type="password" required />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="signup-confirm-password-ha8">
                Confirm Password
              </FieldLabel>
              <Input
                id="signup-confirm-password-ha8"
                type="password"
                required
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
                <Button variant="outline" className="w-full">
                  Sign up with Google
                </Button>
              </Field>
              <Field>
                <p className="text-center text-sm">
                  Already have an account?{" "}
                  <a href="#" className="underline underline-offset-4">
                    Sign in
                  </a>
                </p>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

function LoginForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in to your account</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="login-7x9-email-2kg">Email</FieldLabel>
              <Input
                id="login-7x9-email-2kg"
                type="email"
                placeholder="m@example.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="login-7x9-password-5l8">Password</FieldLabel>
              <Input id="login-7x9-password-5l8" type="password" required />
              <FieldDescription>
                <a href="#" className="text-sm underline underline-offset-4">
                  Forgot your password?
                </a>
              </FieldDescription>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="login-7x9-remember-6lp" />
              <FieldLabel
                htmlFor="login-7x9-remember-6lp"
                className="font-normal"
              >
                Remember me for 30 days
              </FieldLabel>
            </Field>
            <Button type="submit" className="w-full">
              Sign In
            </Button>

            <FieldSeparator />

            <FieldGroup>
              <Button variant="outline" className="w-full">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
              <Button variant="outline" className="w-full">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Continue with GitHub
              </Button>
              <Button variant="outline" className="w-full">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                Continue with Facebook
              </Button>
            </FieldGroup>

            <FieldSeparator>New to our platform?</FieldSeparator>

            <Field>
              <p className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="#"
                  className="font-medium underline underline-offset-4"
                >
                  Create an account
                </a>
              </p>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

function FinderPreferencesForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Finder Preferences</CardTitle>
        <CardDescription>
          Configure what items appear on your desktop
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel>Show these items on the desktop:</FieldLabel>
              <Field orientation="horizontal">
                <Checkbox id="finder-pref-9k2-hard-disks-ljj" />
                <FieldLabel
                  htmlFor="finder-pref-9k2-hard-disks-ljj"
                  className="font-normal"
                >
                  Hard disks
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="finder-pref-9k2-external-disks-1yg" />
                <FieldLabel
                  htmlFor="finder-pref-9k2-external-disks-1yg"
                  className="font-normal"
                >
                  External disks
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="finder-pref-9k2-cds-dvds-fzt" />
                <FieldLabel
                  htmlFor="finder-pref-9k2-cds-dvds-fzt"
                  className="font-normal"
                >
                  CDs, DVDs, and iPods
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="finder-pref-9k2-connected-servers-6l2" />
                <FieldLabel
                  htmlFor="finder-pref-9k2-connected-servers-6l2"
                  className="font-normal"
                >
                  Connected servers
                </FieldLabel>
              </Field>
            </Field>
            <FieldSeparator />
            <Field>
              <FieldLabel>New Finder windows show:</FieldLabel>
              <Select defaultValue="home">
                <SelectTrigger id="finder-pref-9k2-new-window-zga">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recents">
                    <ClockIcon />
                    Recents
                  </SelectItem>
                  <SelectItem value="home">
                    <FolderIcon />
                    shadcn
                  </SelectItem>
                  <SelectItem value="desktop">
                    <MonitorIcon /> Desktop
                  </SelectItem>
                  <SelectItem value="documents">
                    <FileTextIcon /> Documents
                  </SelectItem>
                  <SelectItem value="downloads">
                    <DownloadIcon /> Downloads
                  </SelectItem>
                </SelectContent>
              </Select>
              <InputGroup>
                <InputGroupInput placeholder="Select location" />
                <InputGroupAddon>
                  <IconInfoCircle />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <FieldSeparator />
            <Field orientation="horizontal">
              <Checkbox id="finder-pref-9k2-sync-folders-nep" defaultChecked />
              <FieldContent>
                <FieldLabel htmlFor="finder-pref-9k2-sync-folders-nep">
                  Sync Desktop & Documents folders
                </FieldLabel>
                <FieldDescription>
                  Your Desktop & Documents folders are being synced with iCloud
                  Drive. You can access them from other devices.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="finder-pref-9k2-open-tabs-uui" defaultChecked />
              <FieldLabel htmlFor="finder-pref-9k2-open-tabs-uui">
                Open folders in tabs instead of new windows
              </FieldLabel>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

function ContactForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>
          Get in touch with our team for any questions or support
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="contact-3k1-firstName-ggc">
                  First Name
                </FieldLabel>
                <Input
                  id="contact-3k1-firstName-ggc"
                  placeholder="John"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="contact-3k2-lastName-m0n">
                  Last Name
                </FieldLabel>
                <Input
                  id="contact-3k2-lastName-m0n"
                  placeholder="Doe"
                  required
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="contact-3k2-email-acn">Email</FieldLabel>
              <Input
                id="contact-3k2-email-acn"
                type="email"
                placeholder="john@example.com"
                required
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="subject-exn">Subject</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="support">Technical Support</SelectItem>
                  <SelectItem value="billing">Billing Question</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-3k2-message-k3i">Message</FieldLabel>
              <Textarea
                id="contact-3k2-message-k3i"
                placeholder="Tell us how we can help you..."
                className="min-h-[100px]"
                required
              />
              <FieldDescription>
                Please provide as much detail as possible to help us assist you
                better.
              </FieldDescription>
            </Field>
            <Button type="submit">Send Message</Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

function FeedbackForm() {
  const [rating, setRating] = useState([5])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback Form</CardTitle>
        <CardDescription>
          Help us improve by sharing your experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="feedback-8m4-name-wql">
                Name (Optional)
              </FieldLabel>
              <Input id="feedback-8m4-name-wql" placeholder="Your name" />
              <FieldDescription>Your name is optional.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="feedback-8m4-email-kkm">
                Email (Optional)
              </FieldLabel>
              <Input
                id="feedback-8m4-email-kkm"
                type="email"
                placeholder="your@email.com"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="feedback-8m4-rating-gw9">
                How would you rate your experience?
              </FieldLabel>
              <Slider
                value={rating}
                onValueChange={setRating}
                max={10}
                min={1}
                step={1}
                id="feedback-8m4-rating-gw9"
              />
              <FieldDescription>
                Poor (1) /{" "}
                <span className="font-medium">Rating: {rating[0]}</span> /
                Excellent (10)
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel>What type of feedback is this?</FieldLabel>
              <RadioGroup defaultValue="general">
                <Field orientation="horizontal">
                  <RadioGroupItem value="bug" id="feedback-8m4-bug" />
                  <FieldLabel
                    htmlFor="feedback-8m4-bug"
                    className="font-normal"
                  >
                    Bug Report
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem
                    value="feature"
                    id="feedback-8m4-feature-c2h"
                  />
                  <FieldLabel
                    htmlFor="feedback-8m4-feature-c2h"
                    className="font-normal"
                  >
                    Feature Request
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem
                    value="general"
                    id="feedback-8m4-general-9wc"
                  />
                  <FieldContent>
                    <FieldLabel
                      htmlFor="feedback-8m4-general-9wc"
                      className="font-normal"
                    >
                      General Feedback
                    </FieldLabel>
                  </FieldContent>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem
                    value="complaint"
                    id="feedback-8m4-complaint-9lo"
                  />
                  <FieldLabel
                    htmlFor="feedback-8m4-complaint-9lo"
                    className="font-normal"
                  >
                    Complaint
                  </FieldLabel>
                </Field>
              </RadioGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="feedback-8m4-message-ym5">
                Your Feedback
              </FieldLabel>
              <Textarea
                id="feedback-8m4-message-ym5"
                placeholder="Please share your thoughts, suggestions, or report any issues..."
                className="min-h-[120px]"
                required
              />
              <FieldDescription>
                Please share your thoughts, suggestions, or report any issues...
              </FieldDescription>
            </Field>
            <Field orientation="horizontal">
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Submit</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export function JobApplicationForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Application</CardTitle>
        <CardDescription>Apply for a position at our company</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="job-5p7-firstName-jel">
                  First Name
                </FieldLabel>
                <Input id="job-5p7-firstName-jel" placeholder="John" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="job-5p7-lastName-fl0">
                  Last Name
                </FieldLabel>
                <Input id="job-5p7-lastName-fl0" placeholder="Doe" required />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="job-5p7-email-6cz">Email</FieldLabel>
              <Input
                id="job-5p7-email-6cz"
                type="email"
                placeholder="john@example.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="job-5p7-phone-389">Phone Number</FieldLabel>
              <Input
                id="job-5p7-phone-389"
                type="tel"
                placeholder="+1 (555) 123-4567"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="position-k7f">Position</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend Developer</SelectItem>
                  <SelectItem value="backend">Backend Developer</SelectItem>
                  <SelectItem value="fullstack">
                    Full Stack Developer
                  </SelectItem>
                  <SelectItem value="designer">UI/UX Designer</SelectItem>
                  <SelectItem value="manager">Product Manager</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="experience-5ih">
                Years of Experience
              </FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="2-3">2-3 years</SelectItem>
                  <SelectItem value="4-6">4-6 years</SelectItem>
                  <SelectItem value="7-10">7-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="job-5p7-portfolio-u1j">
                Portfolio/LinkedIn URL
              </FieldLabel>
              <Input
                id="job-5p7-portfolio-u1j"
                type="url"
                placeholder="https://..."
              />
              <FieldDescription>
                Optional: Share your portfolio or professional profile.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="job-5p7-coverLetter-h91">
                Cover Letter
              </FieldLabel>
              <Textarea
                id="job-5p7-coverLetter-h91"
                placeholder="Tell us why you're interested in this position..."
                className="min-h-[120px]"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="job-5p7-resume-ejb">Resume</FieldLabel>
              <Input
                id="job-5p7-resume-ejb"
                type="file"
                accept=".pdf,.doc,.docx"
              />
              <FieldDescription>
                Upload your resume in PDF, DOC, or DOCX format (max 5MB).
              </FieldDescription>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="job-5p7-terms-slt" required />
              <FieldLabel htmlFor="job-5p7-terms-slt">
                I authorize the company to contact me.
              </FieldLabel>
            </Field>

            <Button type="submit">Submit Application</Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export function NewsletterForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Newsletter Signup</CardTitle>
        <CardDescription>
          Stay updated with our latest news and updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="newsletter-2q8-name-sig">Name</FieldLabel>
              <Input
                id="newsletter-2q8-name-sig"
                placeholder="Your name"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newsletter-2q8-email-wfn">Email</FieldLabel>
              <Input
                id="newsletter-2q8-email-wfn"
                type="email"
                placeholder="your@email.com"
                required
              />
              <FieldDescription>
                We&apos;ll send our newsletter to this email address.
              </FieldDescription>
            </Field>
            <FieldSet>
              <FieldLegend>Interests (Select all that apply)</FieldLegend>
              <FieldGroup data-slot="checkbox-group">
                <Field orientation="horizontal">
                  <Checkbox id="newsletter-2q8-tech-b8o" />
                  <FieldLabel
                    htmlFor="newsletter-2q8-tech-b8o"
                    className="font-normal"
                  >
                    Technology News
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="newsletter-2q8-product-3rm" />
                  <FieldLabel
                    htmlFor="newsletter-2q8-product-3rm"
                    className="font-normal"
                  >
                    Product Updates
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="newsletter-2q8-tips-9bh" />
                  <FieldLabel
                    htmlFor="newsletter-2q8-tips-9bh"
                    className="font-normal"
                  >
                    Tips & Tutorials
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="newsletter-2q8-events-r4m" />
                  <FieldLabel
                    htmlFor="newsletter-2q8-events-r4m"
                    className="font-normal"
                  >
                    Events & Webinars
                  </FieldLabel>
                </Field>
              </FieldGroup>
            </FieldSet>
            <Field orientation="horizontal">
              <Checkbox id="newsletter-2q8-privacy-26q" required />
              <FieldLabel htmlFor="newsletter-2q8-privacy-26q">
                I agree to receive marketing emails.
              </FieldLabel>
            </Field>

            <Button type="submit">Subscribe to Newsletter</Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export function PaymentForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>
          Enter your payment details to complete your purchase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="payment-9n3-cardNumber-wre">
                Card Number
              </FieldLabel>
              <Input
                id="payment-9n3-cardNumber-wre"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="payment-9n3-expiry-9oa">
                  Expiry Date
                </FieldLabel>
                <Input
                  id="payment-9n3-expiry-9oa"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="payment-9n3-cvv">CVV</FieldLabel>
                <Input id="payment-9n3-cvv" placeholder="123" maxLength={4} />
                <FieldDescription>3 or 4 digit security code.</FieldDescription>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="payment-9n3-cardName-tko">
                Name on Card
              </FieldLabel>
              <Input id="payment-9n3-cardName-tko" placeholder="John Doe" />
            </Field>

            <Separator />

            <FieldSet>
              <FieldLegend>Billing Address</FieldLegend>
              <FieldDescription>
                Please enter your billing address.
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="payment-9n3-address-a7f">
                    Address
                  </FieldLabel>
                  <Input
                    id="payment-9n3-address-a7f"
                    placeholder="123 Main St"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="payment-9n3-city-sgj">City</FieldLabel>
                    <Input id="payment-9n3-city-sgj" placeholder="New York" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="payment-9n3-zip">ZIP Code</FieldLabel>
                    <Input id="payment-9n3-zip" placeholder="10001" />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="payment-9n3-country-7r4">
                    Country
                  </FieldLabel>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </FieldSet>

            <Field className="justify-between">
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Complete Payment</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export function FormInputDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Input Fields</CardTitle>
        <CardDescription>Different input field configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="input-1a2-basic-ian">Basic Input</FieldLabel>
            <Input id="input-1a2-basic-ian" placeholder="Enter text" />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-1a2-withDesc-k18">
              Input with Description
            </FieldLabel>
            <Input
              id="input-1a2-withDesc-k18"
              placeholder="Enter your username"
            />
            <FieldDescription>
              Choose a unique username for your account.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="input-1a2-descFirst-omn">
              Email Address
            </FieldLabel>
            <FieldDescription>
              We&apos;ll never share your email with anyone.
            </FieldDescription>
            <Input
              id="input-1a2-descFirst-omn"
              type="email"
              placeholder="email@example.com"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-1a2-required-hao">
              Required Field <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="input-1a2-required-hao"
              placeholder="This field is required"
              required
            />
            <FieldDescription>This field must be filled out.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="input-1a2-disabled-xb6">
              Disabled Input
            </FieldLabel>
            <Input
              id="input-1a2-disabled-xb6"
              placeholder="Cannot edit"
              disabled
            />
            <FieldDescription>
              This field is currently disabled.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormTextareaDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Textarea Fields</CardTitle>
        <CardDescription>
          Different textarea field configurations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="textarea-3b5-basic-cag">
              Basic Textarea
            </FieldLabel>
            <Textarea
              id="textarea-3b5-basic-cag"
              placeholder="Enter your message"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="textarea-3b5-comments-16o">
              Comments
            </FieldLabel>
            <Textarea
              id="textarea-3b5-comments-16o"
              placeholder="Share your thoughts..."
              className="min-h-[100px]"
            />
            <FieldDescription>Maximum 500 characters allowed.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="textarea-3b5-bio">Bio</FieldLabel>
            <FieldDescription>
              Tell us about yourself in a few sentences.
            </FieldDescription>
            <Textarea
              id="textarea-3b5-bio"
              placeholder="I am a..."
              className="min-h-[120px]"
            />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormSelectDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Fields</CardTitle>
        <CardDescription>Different select field configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="select-4c6-basic-ttc">Basic Select</FieldLabel>
            <Select>
              <SelectTrigger id="select-4c6-basic-ttc">
                <SelectValue placeholder="Choose an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="select-4c6-country-dc2">Country</FieldLabel>
            <Select>
              <SelectTrigger id="select-4c6-country-dc2">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>
              Select the country where you currently reside.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="select-4c6-timezone-es6">Timezone</FieldLabel>
            <FieldDescription>
              Choose your local timezone for accurate scheduling.
            </FieldDescription>
            <Select>
              <SelectTrigger id="select-4c6-timezone-es6">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="est">Eastern Time</SelectItem>
                <SelectItem value="pst">Pacific Time</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormRadioDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Radio Fields</CardTitle>
        <CardDescription>Different radio field configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Subscription Plan</FieldLegend>
            <RadioGroup defaultValue="free">
              <Field orientation="horizontal">
                <RadioGroupItem value="free" id="free-ejb" />
                <FieldLabel htmlFor="free-ejb" className="font-normal">
                  Free Plan
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="pro" id="pro-y3g" />
                <FieldLabel htmlFor="pro-y3g" className="font-normal">
                  Pro Plan
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="enterprise" id="enterprise-l4t" />
                <FieldLabel htmlFor="enterprise-l4t" className="font-normal">
                  Enterprise
                </FieldLabel>
              </Field>
            </RadioGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Size</FieldLegend>
            <FieldDescription>Select your preferred size.</FieldDescription>
            <RadioGroup
              defaultValue="medium"
              className="grid w-fit grid-cols-2"
            >
              <Field orientation="horizontal">
                <RadioGroupItem value="small" id="size-small-1g9" />
                <FieldLabel htmlFor="size-small-1g9" className="font-normal">
                  Small
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="medium" id="size-medium-okp" />
                <FieldLabel htmlFor="size-medium-okp" className="font-normal">
                  Medium
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="large" id="size-large-tzy" />
                <FieldLabel htmlFor="size-large-tzy" className="font-normal">
                  Large
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="xlarge" id="size-xlarge-2nn" />
                <FieldLabel htmlFor="size-xlarge-2nn" className="font-normal">
                  X-Large
                </FieldLabel>
              </Field>
            </RadioGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Notification Preferences</FieldLegend>
            <FieldDescription>
              Choose how you want to receive notifications.
            </FieldDescription>
            <RadioGroup defaultValue="email">
              <Field orientation="horizontal">
                <RadioGroupItem value="email" id="notify-email-enh" />
                <FieldLabel htmlFor="notify-email-enh" className="font-normal">
                  Email only
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="sms" id="notify-sms" />
                <FieldLabel htmlFor="notify-sms" className="font-normal">
                  SMS only
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="both" id="notify-both-0ed" />
                <FieldLabel htmlFor="notify-both-0ed" className="font-normal">
                  Both Email & SMS
                </FieldLabel>
              </Field>
            </RadioGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Delivery Speed</FieldLegend>
            <RadioGroup
              defaultValue="standard"
              className="flex flex-wrap gap-4"
            >
              <Field orientation="horizontal">
                <RadioGroupItem value="express" id="delivery-express-n5l" />
                <FieldContent>
                  <FieldLabel
                    htmlFor="delivery-express-n5l"
                    className="font-normal"
                  >
                    Express (1-2 days)
                  </FieldLabel>
                  <FieldDescription>Get your order quickly.</FieldDescription>
                </FieldContent>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="standard" id="delivery-standard-14i" />
                <FieldContent>
                  <FieldLabel
                    htmlFor="delivery-standard-14i"
                    className="font-normal"
                  >
                    Standard (3-5 days)
                  </FieldLabel>
                  <FieldDescription>
                    Get your order in a few days.
                  </FieldDescription>
                </FieldContent>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="economy" id="delivery-economy-594" />
                <FieldContent>
                  <FieldLabel
                    htmlFor="delivery-economy-594"
                    className="font-normal"
                  >
                    Economy (5-7 days)
                  </FieldLabel>
                  <FieldDescription>
                    Get your order in a few days.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </RadioGroup>
          </FieldSet>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormCheckboxDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkbox Fields</CardTitle>
        <CardDescription>
          Different checkbox field configurations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field orientation="horizontal">
            <Checkbox id="terms-y7h" />
            <FieldLabel htmlFor="terms-y7h" className="font-normal">
              I agree to the terms and conditions
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="newsletter-sw8" />
            <FieldContent>
              <FieldLabel htmlFor="newsletter-sw8">
                Subscribe to newsletter
              </FieldLabel>
              <FieldDescription>
                Receive weekly updates about new features and promotions.
              </FieldDescription>
            </FieldContent>
          </Field>
          <FieldSet>
            <FieldLegend>Preferences</FieldLegend>
            <FieldDescription>
              Select all that apply to customize your experience.
            </FieldDescription>
            <FieldGroup data-slot="checkbox-group">
              <Field orientation="horizontal">
                <Checkbox id="pref-dark-rfv" />
                <FieldLabel htmlFor="pref-dark-rfv" className="font-normal">
                  Dark mode
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="pref-compact-ti2" />
                <FieldLabel htmlFor="pref-compact-ti2" className="font-normal">
                  Compact view
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="pref-notifications-tut" />
                <FieldLabel
                  htmlFor="pref-notifications-tut"
                  className="font-normal"
                >
                  Enable notifications
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Skills</FieldLegend>
            <FieldGroup className="flex-row flex-wrap gap-3 *:data-[slot=field]:w-fit">
              <Field orientation="horizontal">
                <Checkbox id="javascript-4ee" />
                <FieldLabel htmlFor="javascript-4ee" className="font-normal">
                  JavaScript
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="typescript-cdv" />
                <FieldLabel htmlFor="typescript-cdv" className="font-normal">
                  TypeScript
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="react-qhm" />
                <FieldLabel htmlFor="react-qhm" className="font-normal">
                  React
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="nodejs-ug1" />
                <FieldLabel htmlFor="nodejs-ug1" className="font-normal">
                  Node.js
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="python-azl" />
                <FieldLabel htmlFor="python-azl" className="font-normal">
                  Python
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="database-br8" />
                <FieldLabel htmlFor="database-br8" className="font-normal">
                  Database
                </FieldLabel>
              </Field>
            </FieldGroup>
            <FieldDescription>
              Select all technologies you are proficient with.
            </FieldDescription>
          </FieldSet>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormSliderDemo() {
  const [volume, setVolume] = useState([50])
  const [brightness, setBrightness] = useState([75])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Slider Fields</CardTitle>
        <CardDescription>Different slider field configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="volume-viy">Volume</FieldLabel>
            <Slider
              id="volume-viy"
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="brightness-zke">Screen Brightness</FieldLabel>
            <Slider
              id="brightness-zke"
              value={brightness}
              onValueChange={setBrightness}
              max={100}
              step={5}
            />
            <FieldDescription>
              Current brightness: {brightness[0]}%
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="quality-ccr">Video Quality</FieldLabel>
            <FieldDescription>
              Higher quality uses more bandwidth.
            </FieldDescription>
            <Slider
              id="quality-ccr"
              defaultValue={[720]}
              max={1080}
              min={360}
              step={360}
            />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormSwitchDemo() {
  const [notifications, setNotifications] = useState(false)
  const [marketing, setMarketing] = useState(true)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Switch Fields</CardTitle>
        <CardDescription>Different switch field configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="airplane-mode-c10">Airplane Mode</FieldLabel>
              <FieldDescription>
                Turn on airplane mode to disable all connections.
              </FieldDescription>
            </FieldContent>
            <Switch id="airplane-mode-c10" />
          </Field>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="notifications-rfq">
                Push Notifications
              </FieldLabel>
              <FieldDescription>
                Receive notifications about updates and new features.
              </FieldDescription>
            </FieldContent>
            <Switch
              id="notifications-rfq"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </Field>
          <Field orientation="horizontal">
            <Switch
              id="marketing-7o6"
              checked={marketing}
              onCheckedChange={setMarketing}
              className="mt-0.5"
            />
            <FieldContent>
              <FieldLabel htmlFor="marketing-7o6">Marketing Emails</FieldLabel>
              <FieldDescription>
                Receive emails about new products, features, and more.
              </FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <Switch id="auto-save-eux" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="auto-save-eux">Auto-save</FieldLabel>
              <FieldDescription>
                Automatically save your work every 5 minutes.
              </FieldDescription>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Privacy Settings</FieldLabel>
            <FieldDescription>
              Manage your privacy preferences.
            </FieldDescription>
            <Field orientation="horizontal">
              <Switch id="profile-visible-zaq" defaultChecked />
              <FieldContent>
                <FieldLabel
                  htmlFor="profile-visible-zaq"
                  className="font-normal"
                >
                  Make profile visible to others
                </FieldLabel>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <Switch id="show-email-x90" />
              <FieldContent>
                <FieldLabel htmlFor="show-email-x90" className="font-normal">
                  Show email on profile
                </FieldLabel>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <Switch id="allow-indexing-d58" defaultChecked />
              <FieldContent>
                <FieldLabel
                  htmlFor="allow-indexing-d58"
                  className="font-normal"
                >
                  Allow search engines to index profile
                </FieldLabel>
              </FieldContent>
            </Field>
          </Field>
          <Field orientation="horizontal">
            <Switch id="disabled-switch-4eu" disabled />
            <FieldContent>
              <FieldLabel htmlFor="disabled-switch-4eu" className="opacity-50">
                Disabled Feature
              </FieldLabel>
              <FieldDescription>
                This feature is currently unavailable.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormToggleGroupDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Toggle Group Fields</CardTitle>
        <CardDescription>Different toggle group configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel>View Mode</FieldLabel>
            <ToggleGroup
              type="single"
              defaultValue="grid"
              variant="outline"
              className="w-full"
            >
              <ToggleGroupItem value="list" className="flex-1">
                List
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" className="flex-1">
                Grid
              </ToggleGroupItem>
              <ToggleGroupItem value="cards" className="flex-1">
                Cards
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>
          <Field>
            <FieldLabel>Status Filter</FieldLabel>
            <ToggleGroup type="single" variant="outline" className="flex-wrap">
              <ToggleGroupItem value="active">Active</ToggleGroupItem>
              <ToggleGroupItem value="pending">Pending</ToggleGroupItem>
              <ToggleGroupItem value="completed">Completed</ToggleGroupItem>
            </ToggleGroup>
            <FieldDescription>Filter by multiple statuses.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Subscription Plan</FieldLabel>
            <FieldDescription>
              Select the subscription plan that you want to subscribe to.
            </FieldDescription>
            <ToggleGroup type="single" variant="outline" className="flex-wrap">
              <ToggleGroupItem value="basic">Basic</ToggleGroupItem>
              <ToggleGroupItem value="pro">Pro</ToggleGroupItem>
              <ToggleGroupItem value="enterprise">Enterprise</ToggleGroupItem>
            </ToggleGroup>
          </Field>
          <Field>
            <FieldLabel>Disabled Toggle Group</FieldLabel>
            <ToggleGroup type="single" disabled variant="outline">
              <ToggleGroupItem value="option1">Option 1</ToggleGroupItem>
              <ToggleGroupItem value="option2">Option 2</ToggleGroupItem>
              <ToggleGroupItem value="option3">Option 3</ToggleGroupItem>
            </ToggleGroup>
            <FieldDescription>This toggle group is disabled.</FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormInputTypesDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Text Input Types</CardTitle>
        <CardDescription>Text-based HTML input variations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="text-input-qmg">Text</FieldLabel>
            <Input id="text-input-qmg" type="text" placeholder="Enter text" />
            <FieldDescription>Standard text input field.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="email-input-19f">Email</FieldLabel>
            <Input
              id="email-input-19f"
              type="email"
              placeholder="name@example.com"
            />
            <FieldDescription>Email address with validation.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="password-input-63z">Password</FieldLabel>
            <Input
              id="password-input-63z"
              type="password"
              placeholder="Enter password"
            />
            <FieldDescription>
              Password field with hidden text.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="tel-input-iw1">Phone</FieldLabel>
            <Input
              id="tel-input-iw1"
              type="tel"
              placeholder="+1 (555) 123-4567"
            />
            <FieldDescription>Telephone number input.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="url-input-ku7">URL</FieldLabel>
            <Input
              id="url-input-ku7"
              type="url"
              placeholder="https://example.com"
            />
            <FieldDescription>Website URL with validation.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="search-input-mhf">Search</FieldLabel>
            <Input
              id="search-input-mhf"
              type="search"
              placeholder="Search..."
            />
            <FieldDescription>Search field with clear button.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="number-input-u7u">Number</FieldLabel>
            <Input
              id="number-input-u7u"
              type="number"
              placeholder="42"
              min="0"
              max="100"
              step="1"
            />
            <FieldDescription>Numeric input (0-100).</FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormSpecialInputTypesDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Special Input Types</CardTitle>
        <CardDescription>
          Date, time, file and other special inputs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="date-input-u7h">Date</FieldLabel>
            <Input id="date-input-u7h" type="date" />
            <FieldDescription>Native date picker.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="time-input-2oj">Time</FieldLabel>
            <Input id="time-input-2oj" type="time" />
            <FieldDescription>
              Time selection (24-hour format).
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="datetime-input-3jq">Date & Time</FieldLabel>
            <Input id="datetime-input-3jq" type="datetime-local" />
            <FieldDescription>Combined date and time picker.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="month-input-667">Month</FieldLabel>
            <Input id="month-input-667" type="month" />
            <FieldDescription>Month and year selector.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="week-input-3bv">Week</FieldLabel>
            <Input id="week-input-3bv" type="week" />
            <FieldDescription>Week number selector.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="file-input-hmb">File Upload</FieldLabel>
            <Input id="file-input-hmb" type="file" accept="image/*,.pdf" />
            <FieldDescription>Upload images or PDF files.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="files-input-p9u">Multiple Files</FieldLabel>
            <Input
              id="files-input-p9u"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png"
            />
            <FieldDescription>Upload multiple image files.</FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormOTPDemo() {
  const [value, setValue] = useState("")
  const [pinValue, setPinValue] = useState("")

  return (
    <Card>
      <CardHeader>
        <CardTitle>OTP Input Fields</CardTitle>
        <CardDescription>Different OTP input configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="basic-otp">Verification Code</FieldLabel>
            <InputOTP id="basic-otp" maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </Field>
          <Field>
            <FieldLabel htmlFor="otp-with-desc-5xp">Enter OTP</FieldLabel>
            <InputOTP
              id="otp-with-desc-5xp"
              maxLength={6}
              value={value}
              onChange={setValue}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>
              Enter the 6-digit code sent to your email.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="otp-separator-h39">
              Two-Factor Authentication
            </FieldLabel>
            <InputOTP id="otp-separator-h39" maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>
              Enter the code from your authenticator app.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="pin-input-lqx">PIN Code</FieldLabel>
            <InputOTP
              id="pin-input-lqx"
              maxLength={4}
              pattern={REGEXP_ONLY_DIGITS}
              value={pinValue}
              onChange={setPinValue}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>
              Enter your 4-digit PIN (numbers only).
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="otp-multi-sep">License Key</FieldLabel>
            <InputOTP id="otp-multi-sep" maxLength={8}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={6} />
                <InputOTPSlot index={7} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>
              Enter your 8-character license key.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="otp-custom-hip">Security Code</FieldLabel>
            <FieldDescription>
              Enter the security code to continue.
            </FieldDescription>
            <InputOTP id="otp-custom-hip" maxLength={6}>
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} className="rounded-md border" />
                <InputOTPSlot index={1} className="rounded-md border" />
                <InputOTPSlot index={2} className="rounded-md border" />
                <InputOTPSlot index={3} className="rounded-md border" />
                <InputOTPSlot index={4} className="rounded-md border" />
                <InputOTPSlot index={5} className="rounded-md border" />
              </InputOTPGroup>
            </InputOTP>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormDatePickerDemo() {
  const [date, setDate] = useState<Date>()
  const [birthDate, setBirthDate] = useState<Date>()
  const [appointmentDate, setAppointmentDate] = useState<Date>()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [vacationDates, setVacationDates] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Date Picker Fields</CardTitle>
        <CardDescription>Different date picker configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field data-invalid={true}>
            <FieldLabel htmlFor="basic-date-6st">Select Date</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="basic-date-6st"
                  variant="outline"
                  aria-invalid={true}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </Field>
          <Field>
            <FieldLabel htmlFor="birth-date-0fq">Date of Birth</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="birth-date-0fq"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {birthDate ? (
                    format(birthDate, "PPP")
                  ) : (
                    <span>Select your birth date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                />
              </PopoverContent>
            </Popover>
            <FieldDescription>
              We use this to calculate your age and provide age-appropriate
              content.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="appointment-f44">Appointment Date</FieldLabel>
            <FieldDescription>
              Select a date for your appointment (weekdays only).
            </FieldDescription>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="appointment-f44"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !appointmentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {appointmentDate ? (
                    format(appointmentDate, "PPP")
                  ) : (
                    <span>Schedule appointment</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={appointmentDate}
                  onSelect={setAppointmentDate}
                  disabled={(date) =>
                    date < new Date() ||
                    date.getDay() === 0 ||
                    date.getDay() === 6
                  }
                />
              </PopoverContent>
            </Popover>
          </Field>
          <Field>
            <FieldLabel htmlFor="date-range-7yr">Date Range</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-range-7yr"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <FieldDescription>
              Select start and end dates for your report.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="vacation-w9w">Vacation Dates</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="vacation-w9w"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !vacationDates && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {vacationDates?.from ? (
                    vacationDates.to ? (
                      <>
                        {format(vacationDates.from, "LLL dd, y")} -{" "}
                        {format(vacationDates.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(vacationDates.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Select vacation dates</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex flex-col">
                  <div className="flex gap-2 border-b p-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setVacationDates({
                          from: new Date(),
                          to: addDays(new Date(), 7),
                        })
                      }
                    >
                      Next 7 days
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setVacationDates({
                          from: new Date(),
                          to: addDays(new Date(), 14),
                        })
                      }
                    >
                      Next 2 weeks
                    </Button>
                  </div>
                  <Calendar
                    mode="range"
                    defaultMonth={vacationDates?.from}
                    selected={vacationDates}
                    onSelect={setVacationDates}
                    numberOfMonths={2}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <FieldDescription>
              Choose your vacation period. Quick presets available.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="disabled-date-1vz" className="opacity-50">
              Event Date (Disabled)
            </FieldLabel>
            <Button
              id="disabled-date-1vz"
              variant="outline"
              className="w-full justify-start text-left font-normal opacity-50"
              disabled
            >
              <CalendarIcon />
              <span>Date selection disabled</span>
            </Button>
            <FieldDescription>
              This field is currently disabled.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormFieldSetDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>FieldSet & FieldLegend</CardTitle>
        <CardDescription>Different fieldset configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Basic FieldSet</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="basic-name-czt">Name</FieldLabel>
                <Input id="basic-name-czt" placeholder="Enter your name" />
              </Field>
              <Field>
                <FieldLabel htmlFor="basic-email-32q">Email</FieldLabel>
                <Input
                  id="basic-email-32q"
                  type="email"
                  placeholder="email@example.com"
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>FieldSet with Description</FieldLegend>
            <FieldDescription>
              This fieldset includes a description to provide context.
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="address-street-atj">
                  Street Address
                </FieldLabel>
                <Input id="address-street-atj" placeholder="123 Main St" />
              </Field>
              <FieldGroup className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="address-city-tpi">City</FieldLabel>
                  <Input id="address-city-tpi" placeholder="New York" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="address-zip">ZIP Code</FieldLabel>
                  <Input id="address-zip" placeholder="10001" />
                </Field>
              </FieldGroup>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Communication Preferences</FieldLegend>
            <FieldDescription>
              Choose how you&apos;d like us to keep in touch with you.
            </FieldDescription>
            <FieldGroup>
              <FieldSet>
                <FieldLegend className="text-sm">
                  Preferred Contact Method
                </FieldLegend>
                <FieldDescription>
                  Choose how you&apos;d like us to keep in touch with you.
                </FieldDescription>
                <RadioGroup defaultValue="email">
                  <Field orientation="horizontal">
                    <RadioGroupItem value="email" id="contact-email-hxb" />
                    <FieldLabel
                      htmlFor="contact-email-hxb"
                      className="font-normal"
                    >
                      Email
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <RadioGroupItem value="phone" id="contact-phone-7id" />
                    <FieldLabel
                      htmlFor="contact-phone-7id"
                      className="font-normal"
                    >
                      Phone
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <RadioGroupItem value="sms" id="contact-sms" />
                    <FieldLabel htmlFor="contact-sms" className="font-normal">
                      SMS
                    </FieldLabel>
                  </Field>
                </RadioGroup>
              </FieldSet>
              <FieldSet>
                <FieldLegend className="text-sm">
                  Notification Types
                </FieldLegend>
                <FieldDescription>
                  Choose which notifications you&apos;d like to receive.
                </FieldDescription>
                <FieldGroup className="gap-3">
                  <Field orientation="horizontal">
                    <Checkbox id="updates-2sv" defaultChecked />
                    <FieldLabel htmlFor="updates-2sv" className="font-normal">
                      Product updates
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="newsletters-ejn" />
                    <FieldLabel
                      htmlFor="newsletters-ejn"
                      className="font-normal"
                    >
                      Newsletters
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="promotions-9xv" />
                    <FieldLabel
                      htmlFor="promotions-9xv"
                      className="font-normal"
                    >
                      Promotional offers
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Account Settings</FieldLegend>
            <FieldGroup>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="two-factor-kei">
                    Two-Factor Authentication
                  </FieldLabel>
                  <FieldDescription>
                    Add an extra layer of security to your account.
                  </FieldDescription>
                </FieldContent>
                <Switch id="two-factor-kei" />
              </Field>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="public-profile-bbt">
                    Public Profile
                  </FieldLabel>
                  <FieldDescription>
                    Make your profile visible to other users.
                  </FieldDescription>
                </FieldContent>
                <Switch id="public-profile-bbt" defaultChecked />
              </Field>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="activity-status-2la">
                    Show Activity Status
                  </FieldLabel>
                  <FieldDescription>
                    Let others see when you&apos;re online.
                  </FieldDescription>
                </FieldContent>
                <Switch id="activity-status-2la" />
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldLegend>Emergency Contact</FieldLegend>
            <FieldDescription>
              Provide emergency contact information for safety purposes.
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="emergency-name-id4">
                  Contact Name
                </FieldLabel>
                <Input id="emergency-name-id4" placeholder="Jane Doe" />
                <FieldDescription>
                  Full name of your emergency contact.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="emergency-relationship-9ja">
                  Relationship
                </FieldLabel>
                <Select>
                  <SelectTrigger id="emergency-relationship-9ja">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="emergency-phone-3de">
                  Phone Number
                </FieldLabel>
                <Input
                  id="emergency-phone-3de"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                />
                <FieldDescription>
                  Best number to reach your emergency contact.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Additional Information</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="comments-sxl">Comments</FieldLabel>
                <Textarea
                  id="comments-sxl"
                  placeholder="Any additional information..."
                  className="min-h-[100px]"
                />
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="agree-terms-04d" />
                <FieldContent>
                  <FieldLabel htmlFor="agree-terms-04d" className="font-normal">
                    I agree to the terms and conditions
                  </FieldLabel>
                </FieldContent>
              </Field>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormFieldSeparatorDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Field Separator</CardTitle>
        <CardDescription>
          Different ways to use the FieldSeparator component
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="section1-input-ieg">Section 1</FieldLabel>
            <Input id="section1-input-ieg" placeholder="First section input" />
            <FieldDescription>
              This is the first section of the form.
            </FieldDescription>
          </Field>
          <FieldSeparator />
          <Field>
            <FieldLabel htmlFor="section2-input-mh9">Section 2</FieldLabel>
            <Input id="section2-input-mh9" placeholder="Second section input" />
            <FieldDescription>
              A simple separator line appears above this section.
            </FieldDescription>
          </Field>
          <FieldSeparator>Or continue with</FieldSeparator>
          <Field>
            <Button variant="outline" className="w-full">
              Alternative Option 1
            </Button>
            <Button variant="outline" className="w-full">
              Alternative Option 2
            </Button>
          </Field>
          <FieldSeparator>Additional Options</FieldSeparator>
          <FieldGroup>
            <Field orientation="horizontal">
              <Checkbox id="option1-ntl" />
              <FieldContent>
                <FieldLabel htmlFor="option1-ntl" className="font-normal">
                  Enable additional features
                </FieldLabel>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="option2-n0m" />
              <FieldContent>
                <FieldLabel htmlFor="option2-n0m" className="font-normal">
                  Subscribe to updates
                </FieldLabel>
              </FieldContent>
            </Field>
          </FieldGroup>
          <FieldSeparator />
          <Field>
            <FieldLabel htmlFor="final-section-mk8">Final Section</FieldLabel>
            <Textarea
              id="final-section-mk8"
              placeholder="Any additional comments..."
              className="min-h-[80px]"
            />
          </Field>
          <FieldSeparator>Or choose a different path</FieldSeparator>
          <RadioGroup defaultValue="option1">
            <Field orientation="horizontal">
              <RadioGroupItem value="option1" id="path1-pgt" />
              <FieldLabel htmlFor="path1-pgt" className="font-normal">
                Option Path 1
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="option2" id="path2-7pd" />
              <FieldLabel htmlFor="path2-7pd" className="font-normal">
                Option Path 2
              </FieldLabel>
            </Field>
          </RadioGroup>
          <FieldSeparator>Account Settings</FieldSeparator>
          <FieldGroup>
            <Field orientation="horizontal">
              <Switch id="separator-7e9-notifications-5r4" />
              <FieldContent>
                <FieldLabel htmlFor="separator-7e9-notifications-5r4">
                  Enable Notifications
                </FieldLabel>
                <FieldDescription>
                  Receive updates about your account activity.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <Switch id="separator-7e9-privacy-81v" />
              <FieldContent>
                <FieldLabel htmlFor="separator-7e9-privacy-81v">
                  Make Profile Public
                </FieldLabel>
                <FieldDescription>
                  Allow others to view your profile information.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
          <Field>
            <Button type="submit" className="w-full">
              Submit Form
            </Button>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormFieldGroupOutlineDemo() {
  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Notification Settings</FieldLegend>
        <FieldDescription>
          Configure how and when you receive notifications
        </FieldDescription>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="outline-demo-8h3-email-notif-vk0">
                Email Notifications
              </FieldLabel>
              <FieldDescription>
                Receive updates via email about your account activity
              </FieldDescription>
            </FieldContent>
            <Switch id="outline-demo-8h3-email-notif-vk0" defaultChecked />
          </Field>
          <FieldSeparator />
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="outline-demo-8h3-push-notif-5m7">
                Push Notifications
              </FieldLabel>
              <FieldDescription>
                Get instant notifications on your device
              </FieldDescription>
            </FieldContent>
            <Switch id="outline-demo-8h3-push-notif-5m7" defaultChecked />
          </Field>
          <FieldSeparator />
          <Field orientation="horizontal">
            <Switch id="outline-demo-8h3-sms-notif-ew4" />
            <FieldContent>
              <FieldLabel htmlFor="outline-demo-8h3-sms-notif-ew4">
                SMS Notifications
              </FieldLabel>
              <FieldDescription>
                Receive text messages for important updates
              </FieldDescription>
            </FieldContent>
          </Field>
          <FieldSeparator />
          <Field orientation="horizontal">
            <Switch id="outline-demo-8h3-weekly-digest-xor" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="outline-demo-8h3-weekly-digest-xor">
                Weekly Digest
              </FieldLabel>
              <FieldDescription>
                Get a summary of your activity every week
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend>Privacy Settings</FieldLegend>
        <FieldDescription>
          Control your privacy and data sharing preferences
        </FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="contact-3k2-firstName-q1r">
              First Name
            </FieldLabel>
            <Input id="contact-3k2-firstName-q1r" placeholder="John" required />
          </Field>
          <FieldSet>
            <FieldLegend variant="label">
              Show these items on the desktop:
            </FieldLegend>
            <FieldDescription>
              Select the items you want to show on the desktop.
            </FieldDescription>
            <FieldGroup className="gap-3">
              <Field orientation="horizontal">
                <Checkbox id="finder-pref-9k2-hard-disks-ljj" />
                <FieldLabel
                  htmlFor="finder-pref-9k2-hard-disks-ljj"
                  className="font-normal"
                >
                  Hard disks
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="finder-pref-9k2-external-disks-1yg" />
                <FieldLabel
                  htmlFor="finder-pref-9k2-external-disks-1yg"
                  className="font-normal"
                >
                  External disks
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="finder-pref-9k2-cds-dvds-fzt" />
                <FieldLabel
                  htmlFor="finder-pref-9k2-cds-dvds-fzt"
                  className="font-normal"
                >
                  CDs, DVDs, and iPods
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="finder-pref-9k2-connected-servers-6l2" />
                <FieldLabel
                  htmlFor="finder-pref-9k2-connected-servers-6l2"
                  className="font-normal"
                >
                  Connected servers
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="outline-demo-8h3-profile-public-agy">
                Public Profile
              </FieldLabel>
              <FieldDescription>
                Make your profile visible to everyone
              </FieldDescription>
            </FieldContent>
            <Switch id="outline-demo-8h3-profile-public-agy" />
          </Field>
          <FieldSeparator />
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="outline-demo-8h3-share-data-088">
                Share Usage Data
              </FieldLabel>
              <FieldDescription>
                Help improve our services by sharing anonymous usage data. This
                data helps us understand how our product is used and how we can
                improve it.
              </FieldDescription>
            </FieldContent>
            <Switch id="outline-demo-8h3-share-data-088" />
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  )
}

export function ProfileSettingsForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Update your profile information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel>Profile Photo</FieldLabel>
              <div className="flex items-center space-x-4">
                <Avatar className="size-12">
                  <AvatarImage src="/abstract-profile.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button variant="outline" type="button">
                  Change Photo
                </Button>
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="profileFirstName-h2r">
                  First Name
                </FieldLabel>
                <Input id="profileFirstName-h2r" defaultValue="John" />
              </Field>
              <Field>
                <FieldLabel htmlFor="profileLastName-cal">Last Name</FieldLabel>
                <Input id="profileLastName-cal" defaultValue="Doe" />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="profileEmail-e4m">Email</FieldLabel>
              <Input
                id="profileEmail-e4m"
                type="email"
                defaultValue="john@example.com"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone-olk">Phone Number</FieldLabel>
              <Input
                id="phone-olk"
                type="tel"
                placeholder="+1 (555) 123-4567"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="bio-jlq">Bio</FieldLabel>
              <Textarea
                id="bio-jlq"
                placeholder="Tell us about yourself..."
                className="min-h-[80px]"
              />
            </Field>

            <FieldSet>
              <FieldLegend>Notification Preferences</FieldLegend>
              <FieldDescription>
                Manage your notification preferences.
              </FieldDescription>
              <FieldGroup>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor="emailNotifications-xfj">
                      Email notifications
                    </FieldLabel>
                    <FieldDescription>
                      Receive emails about new products, features, and more. If
                      you don&apos;t want to receive these emails, you can turn
                      them off.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="emailNotifications-xfj"
                    defaultChecked
                    className="ml-auto"
                  />
                </Field>
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="pushNotifications-ofh">
                    Push notifications
                  </FieldLabel>
                  <Switch id="pushNotifications-ofh" />
                </Field>
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="marketingEmails-8hc">
                    Marketing emails
                  </FieldLabel>
                  <Switch
                    id="marketingEmails-8hc"
                    defaultChecked
                    className="ml-auto"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
            <Field orientation="horizontal" className="justify-end">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export function SurveyForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Survey</CardTitle>
        <CardDescription>
          Help us understand your needs better (5 minutes)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="surveyName-eqj">Name (Optional)</FieldLabel>
              <Input id="surveyName-eqj" placeholder="Your name" />
            </Field>
            <Field>
              <FieldLabel htmlFor="ageGroup-302">Age Group</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-34">25-34</SelectItem>
                  <SelectItem value="35-44">35-44</SelectItem>
                  <SelectItem value="45-54">45-54</SelectItem>
                  <SelectItem value="55+">55+</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>How often do you use our product?</FieldLabel>
              <RadioGroup>
                <Field orientation="horizontal">
                  <RadioGroupItem value="daily" id="daily-lrv" />
                  <FieldLabel htmlFor="daily-lrv">Daily</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem value="weekly" id="weekly-mga" />
                  <FieldLabel htmlFor="weekly-mga">Weekly</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem value="monthly" id="monthly-7gl" />
                  <FieldLabel htmlFor="monthly-7gl">Monthly</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem value="rarely" id="rarely-hlw" />
                  <FieldLabel htmlFor="rarely-hlw">Rarely</FieldLabel>
                </Field>
              </RadioGroup>
            </Field>
            <Field>
              <FieldLabel>
                Which features do you use most? (Select all that apply)
              </FieldLabel>
              <div className="grid w-full grid-cols-2 gap-2">
                <Field orientation="horizontal">
                  <Checkbox id="dashboard-epk" />
                  <FieldLabel htmlFor="dashboar d-epk" className="text-sm">
                    Dashboard
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="reports-jkm" />
                  <FieldLabel htmlFor="reports-jkm" className="text-sm">
                    Reports
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="analytics-kwm" />
                  <FieldLabel htmlFor="analytics-kwm" className="text-sm">
                    Analytics
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="integrations-euz" />
                  <FieldLabel htmlFor="integrations-euz" className="text-sm">
                    Integrations
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="api-e2h" />
                  <FieldLabel htmlFor="api-e2h" className="text-sm">
                    API Access
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="support-qq9" />
                  <FieldLabel htmlFor="support-qq9" className="text-sm">
                    Support
                  </FieldLabel>
                </Field>
              </div>
            </Field>
            <Field>
              <FieldLabel>How satisfied are you with our product?</FieldLabel>
              <RadioGroup>
                <Field orientation="horizontal">
                  <RadioGroupItem
                    value="very-satisfied"
                    id="very-satisfied-ok5"
                  />
                  <FieldLabel htmlFor="very-satisfied-ok5">
                    Very Satisfied
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem value="satisfied" id="satisfied-hn4" />
                  <FieldLabel htmlFor="satisfied-hn4">Satisfied</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem value="neutral" id="neutral-6az" />
                  <FieldLabel htmlFor="neutral-6az">Neutral</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem value="dissatisfied" id="dissatisfied-sy9" />
                  <FieldLabel htmlFor="dissatisfied-sy9">
                    Dissatisfied
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem
                    value="very-dissatisfied"
                    id="very-dissatisfied-xs2"
                  />
                  <FieldLabel htmlFor="very-dissatisfied-xs2">
                    Very Dissatisfied
                  </FieldLabel>
                </Field>
              </RadioGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="improvements-u5u">
                What improvements would you like to see?
              </FieldLabel>
              <Textarea
                id="improvements-u5u"
                placeholder="Share your suggestions for improvements..."
                className="min-h-[80px]"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="recommend-aym">
                Would you recommend our product to others?
              </FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select recommendation level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="definitely">Definitely</SelectItem>
                  <SelectItem value="probably">Probably</SelectItem>
                  <SelectItem value="maybe">Maybe</SelectItem>
                  <SelectItem value="probably-not">Probably Not</SelectItem>
                  <SelectItem value="definitely-not">Definitely Not</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export function ComplexFormDemo() {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Job Application Form</CardTitle>
        <CardDescription>
          Complete all sections to submit your application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Personal Information</FieldLegend>
              <FieldDescription>
                Your basic contact information.
              </FieldDescription>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="complex-6d8-firstName-dsv">
                      First Name
                    </FieldLabel>
                    <Input
                      id="complex-6d8-firstName-dsv"
                      placeholder="John"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="complex-6d8-lastName-i08">
                      Last Name
                    </FieldLabel>
                    <Input
                      id="complex-6d8-lastName-i08"
                      placeholder="Doe"
                      required
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="complex-6d8-email-yq8">
                    Email Address
                  </FieldLabel>
                  <Input
                    id="complex-6d8-email-yq8"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                  />
                  <FieldDescription>
                    We&apos;ll use this for all communications.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="complex-6d8-phone-a7k">
                    Phone Number
                  </FieldLabel>
                  <Input
                    id="complex-6d8-phone-a7k"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Professional Background</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="position-k7f">
                    Position Applying For
                  </FieldLabel>
                  <Select>
                    <SelectTrigger id="position-k7f">
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">
                        Frontend Developer
                      </SelectItem>
                      <SelectItem value="backend">Backend Developer</SelectItem>
                      <SelectItem value="fullstack">
                        Full Stack Developer
                      </SelectItem>
                      <SelectItem value="designer">UI/UX Designer</SelectItem>
                      <SelectItem value="pm">Product Manager</SelectItem>
                      <SelectItem value="devops">DevOps Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="experience-5ih">
                    Years of Experience
                  </FieldLabel>
                  <Slider id="experience-5ih" max={20} min={0} step={1} />
                  <FieldDescription>Years of experience</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel>Employment Type Preference</FieldLabel>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    className="w-full"
                  >
                    <ToggleGroupItem value="remote" className="flex-1">
                      Remote
                    </ToggleGroupItem>
                    <ToggleGroupItem value="office" className="flex-1">
                      Office
                    </ToggleGroupItem>
                    <ToggleGroupItem value="hybrid" className="flex-1">
                      Hybrid
                    </ToggleGroupItem>
                  </ToggleGroup>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>Additional Information</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="portfolio-6km">Portfolio URL</FieldLabel>
                  <Input
                    id="portfolio-6km"
                    type="url"
                    placeholder="https://yourportfolio.com"
                  />
                  <FieldDescription>
                    Optional: Share your portfolio or GitHub profile
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="coverLetter-6re">
                    Cover Letter
                  </FieldLabel>
                  <Textarea
                    id="coverLetter-6re"
                    placeholder="Tell us why you're a great fit for this position..."
                    className="min-h-[120px]"
                  />
                  <FieldDescription>
                    Briefly describe your interest and qualifications (500 words
                    max)
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="resume-yyr">Upload Resume</FieldLabel>
                  <Input id="resume-yyr" type="file" accept=".pdf,.doc,.docx" />
                  <FieldDescription>
                    PDF or Word document (max 5MB)
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="references-fcs">
                    References Available
                  </FieldLabel>
                  <RadioGroup defaultValue="yes">
                    <Field orientation="horizontal">
                      <RadioGroupItem value="yes" id="ref-yes" />
                      <FieldLabel htmlFor="ref-yes" className="font-normal">
                        Yes, upon request
                      </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                      <RadioGroupItem value="no" id="ref-no-pqi" />
                      <FieldLabel htmlFor="ref-no-pqi" className="font-normal">
                        No
                      </FieldLabel>
                    </Field>
                  </RadioGroup>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>Verification</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="verification-pj8">
                    Enter Verification Code
                  </FieldLabel>
                  <FieldDescription>
                    Enter the 6-digit code sent to your email
                  </FieldDescription>
                  <InputOTP id="verification-pj8" maxLength={6}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </Field>

                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor="notifications-rfq">
                      Email Notifications
                    </FieldLabel>
                    <FieldDescription>
                      Receive updates about your application status
                    </FieldDescription>
                  </FieldContent>
                  <Switch id="notifications-rfq" defaultChecked />
                </Field>
                <FieldGroup>
                  <Field orientation="horizontal">
                    <Checkbox id="terms-y7h" required />
                    <FieldLabel htmlFor="terms-y7h" className="font-normal">
                      I agree to the terms and conditions and privacy policy
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="accurate-vte" required />
                    <FieldLabel htmlFor="accurate-vte" className="font-normal">
                      I confirm that all information provided is accurate
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </FieldSet>
            <Field orientation="horizontal">
              <Button variant="outline">Save Draft</Button>
              <Button type="submit">Submit Application</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export function ComplexFormInvalidDemo() {
  const [startDate, setStartDate] = useState<Date>()
  const [experience, setExperience] = useState([3])
  const [workType, setWorkType] = useState("hybrid")

  return (
    <Card className="w-full max-w-3xl">
      <CardContent>
        <form>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Personal Information</FieldLegend>
              <FieldDescription>
                Your basic contact information.
              </FieldDescription>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field data-invalid>
                    <FieldLabel htmlFor="firstName-invalid-ygm">
                      First Name
                    </FieldLabel>
                    <Input
                      id="firstName-invalid-ygm"
                      placeholder="John"
                      required
                      aria-invalid
                    />
                  </Field>
                  <Field data-invalid>
                    <FieldLabel htmlFor="lastName-invalid-qlq">
                      Last Name
                    </FieldLabel>
                    <Input
                      id="lastName-invalid-qlq"
                      placeholder="Doe"
                      required
                      aria-invalid
                    />
                  </Field>
                </div>
                <Field data-invalid>
                  <FieldLabel htmlFor="email-invalid-8tl">
                    Email Address
                  </FieldLabel>
                  <Input
                    id="email-invalid-8tl"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                    aria-invalid
                  />
                  <FieldDescription>
                    We&apos;ll use this for all communications.
                  </FieldDescription>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field data-invalid>
                    <FieldLabel htmlFor="phone-invalid-2r4">
                      Phone Number
                    </FieldLabel>
                    <Input
                      id="phone-invalid-2r4"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      aria-invalid
                    />
                  </Field>
                  <Field data-invalid>
                    <FieldLabel htmlFor="birthdate-invalid-49m">
                      Date of Birth
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="birthdate-invalid-49m"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
                          {startDate ? (
                            format(startDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          aria-invalid
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                </div>
                <Field data-invalid>
                  <FieldLabel htmlFor="coverLetter-invalid-6n9">
                    Cover Letter
                  </FieldLabel>
                  <Textarea
                    id="coverLetter-invalid-6n9"
                    placeholder="Tell us why you're a great fit for this position..."
                    className="min-h-[120px]"
                    aria-invalid
                  />
                  <FieldDescription>
                    Briefly describe your interest and qualifications (500 words
                    max)
                  </FieldDescription>
                </Field>
                <Field data-invalid>
                  <FieldLabel htmlFor="resume-invalid-b6z">
                    Upload Resume
                  </FieldLabel>
                  <Input
                    id="resume-invalid-b6z"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    aria-invalid
                  />
                  <FieldDescription>
                    PDF or Word document (max 5MB)
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Professional Background</FieldLegend>
              <FieldGroup>
                <Field data-invalid>
                  <FieldLabel htmlFor="position-invalid-1fv">
                    Position Applying For
                  </FieldLabel>
                  <Select>
                    <SelectTrigger id="position-invalid-1fv" aria-invalid>
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">
                        Frontend Developer
                      </SelectItem>
                      <SelectItem value="backend">Backend Developer</SelectItem>
                      <SelectItem value="fullstack">
                        Full Stack Developer
                      </SelectItem>
                      <SelectItem value="designer">UI/UX Designer</SelectItem>
                      <SelectItem value="pm">Product Manager</SelectItem>
                      <SelectItem value="devops">DevOps Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field data-invalid>
                  <FieldLabel htmlFor="experience-invalid-xri">
                    Years of Experience
                  </FieldLabel>
                  <Slider
                    id="experience-invalid-xri"
                    value={experience}
                    onValueChange={setExperience}
                    max={20}
                    min={0}
                    step={1}
                  />
                  <FieldDescription>
                    {experience[0]} {experience[0] === 1 ? "year" : "years"} of
                    experience
                  </FieldDescription>
                </Field>
                <Field data-invalid>
                  <FieldLabel>Employment Type Preference</FieldLabel>
                  <ToggleGroup
                    type="single"
                    value={workType}
                    onValueChange={setWorkType}
                    variant="outline"
                    className="w-full"
                  >
                    <ToggleGroupItem value="remote" className="flex-1">
                      Remote
                    </ToggleGroupItem>
                    <ToggleGroupItem value="office" className="flex-1">
                      Office
                    </ToggleGroupItem>
                    <ToggleGroupItem value="hybrid" className="flex-1">
                      Hybrid
                    </ToggleGroupItem>
                  </ToggleGroup>
                </Field>
                <FieldSet>
                  <FieldLegend>Technical Skills</FieldLegend>
                  <FieldDescription>Select all that apply</FieldDescription>
                  <FieldGroup className="grid grid-cols-3 gap-3">
                    <Field data-invalid orientation="horizontal">
                      <Checkbox id="skill-ts-invalid-khi" aria-invalid />
                      <FieldLabel
                        htmlFor="skill-ts-invalid-khi"
                        className="font-normal"
                      >
                        TypeScript
                      </FieldLabel>
                    </Field>
                    <Field data-invalid orientation="horizontal">
                      <Checkbox id="skill-react-invalid-oxj" aria-invalid />
                      <FieldLabel
                        htmlFor="skill-react-invalid-oxj"
                        className="font-normal"
                      >
                        React
                      </FieldLabel>
                    </Field>
                    <Field data-invalid orientation="horizontal">
                      <Checkbox id="skill-node-invalid-y18" aria-invalid />
                      <FieldLabel
                        htmlFor="skill-node-invalid-y18"
                        className="font-normal"
                      >
                        Node.js
                      </FieldLabel>
                    </Field>
                    <Field data-invalid orientation="horizontal">
                      <Checkbox id="skill-python-invalid-3jp" aria-invalid />
                      <FieldLabel
                        htmlFor="skill-python-invalid-3jp"
                        className="font-normal"
                      >
                        Python
                      </FieldLabel>
                    </Field>
                    <Field data-invalid orientation="horizontal">
                      <Checkbox id="skill-docker-invalid-5b0" aria-invalid />
                      <FieldLabel
                        htmlFor="skill-docker-invalid-5b0"
                        className="font-normal"
                      >
                        Docker
                      </FieldLabel>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Verification</FieldLegend>
              <FieldGroup>
                <Field data-invalid>
                  <FieldLabel htmlFor="verification-invalid-zyx">
                    Enter Verification Code
                  </FieldLabel>
                  <FieldDescription>
                    Enter the 6-digit code sent to your email
                  </FieldDescription>
                  <InputOTP id="verification-invalid-zyx" maxLength={6}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} aria-invalid />
                      <InputOTPSlot index={1} aria-invalid />
                      <InputOTPSlot index={2} aria-invalid />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} aria-invalid />
                      <InputOTPSlot index={4} aria-invalid />
                      <InputOTPSlot index={5} aria-invalid />
                    </InputOTPGroup>
                  </InputOTP>
                </Field>
                <Field data-invalid orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor="notifications-invalid-73q">
                      Email Notifications
                    </FieldLabel>
                    <FieldDescription>
                      Receive updates about your application status
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="notifications-invalid-73q"
                    defaultChecked
                    className="ml-auto"
                    aria-invalid
                  />
                </Field>
                <FieldGroup>
                  <Field data-invalid orientation="horizontal">
                    <Checkbox id="terms-invalid-0x4" required />
                    <FieldLabel
                      htmlFor="terms-invalid-0x4"
                      className="font-normal"
                    >
                      I agree to the terms and conditions and privacy policy
                    </FieldLabel>
                  </Field>
                  <Field data-invalid orientation="horizontal">
                    <Checkbox id="accurate-invalid-z0j" required />
                    <FieldLabel
                      htmlFor="accurate-invalid-z0j"
                      className="font-normal"
                    >
                      I confirm that all information provided is accurate
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </FieldSet>
            <Field orientation="horizontal">
              <Button variant="outline">Save Draft</Button>
              <Button type="submit">Submit Application</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export function FormOrientationDemo() {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Field Orientation Examples</CardTitle>
        <CardDescription>
          Demonstrating vertical, horizontal, and responsive orientations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Vertical Orientation (Default)</FieldLegend>
            <FieldDescription>
              Label appears above the input - best for mobile and narrow layouts
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="vertical-name">Full Name</FieldLabel>
                <Input id="vertical-name" placeholder="Enter your name" />
                <FieldDescription>
                  This field uses vertical orientation
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="vertical-select">Country</FieldLabel>
                <Select>
                  <SelectTrigger id="vertical-select">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="vertical-notifications">
                    Email Notifications
                  </FieldLabel>
                  <FieldDescription>
                    Receive product updates and news
                  </FieldDescription>
                </FieldContent>
                <Switch id="vertical-notifications" />
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Horizontal Orientation</FieldLegend>
            <FieldDescription>
              Label appears to the left of the input - great for desktop forms
              with short labels
            </FieldDescription>
            <FieldGroup>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="horizontal-name">Name</FieldLabel>
                  <FieldDescription>Your display name</FieldDescription>
                </FieldContent>
                <Input id="horizontal-name" placeholder="Enter name" />
              </Field>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="horizontal-theme">Theme</FieldLabel>
                  <FieldDescription>
                    Choose your preferred theme
                  </FieldDescription>
                </FieldContent>
                <Select>
                  <SelectTrigger id="horizontal-theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="horizontal-volume">Volume</FieldLabel>
                  <FieldDescription>Adjust audio level</FieldDescription>
                </FieldContent>
                <Slider id="horizontal-volume" defaultValue={[50]} max={100} />
              </Field>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="horizontal-auto-save">
                    Auto Save
                  </FieldLabel>
                  <FieldDescription>
                    Automatically save changes
                  </FieldDescription>
                </FieldContent>
                <Switch id="horizontal-auto-save" defaultChecked />
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Responsive Orientation</FieldLegend>
            <FieldDescription>
              Vertical on mobile, horizontal on desktop - the best of both
              worlds
            </FieldDescription>
            <FieldGroup>
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="responsive-username">
                    Username
                  </FieldLabel>
                  <FieldDescription>Choose a unique username</FieldDescription>
                </FieldContent>
                <Input id="responsive-username" placeholder="username" />
              </Field>
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="responsive-language">
                    Language
                  </FieldLabel>
                  <FieldDescription>
                    Select your preferred language
                  </FieldDescription>
                </FieldContent>
                <Select>
                  <SelectTrigger id="responsive-language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="responsive-brightness">
                    Brightness
                  </FieldLabel>
                  <FieldDescription>Adjust screen brightness</FieldDescription>
                </FieldContent>
                <Slider
                  id="responsive-brightness"
                  defaultValue={[75]}
                  max={100}
                />
              </Field>
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="responsive-location">
                    Location Services
                  </FieldLabel>
                  <FieldDescription>
                    Allow apps to access your location
                  </FieldDescription>
                </FieldContent>
                <Switch id="responsive-location" />
              </Field>
              <Field orientation="responsive">
                <Checkbox id="responsive-checkbox" />
                <FieldLabel
                  htmlFor="responsive-checkbox"
                  className="font-normal"
                >
                  I agree to the terms and conditions
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

function CheckoutForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>
          Complete your order by filling in the details below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Shipping Information</FieldLegend>
              <FieldDescription>
                Enter your shipping address where we&apos;ll deliver your order
              </FieldDescription>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-first-name-dso">
                      First Name
                    </FieldLabel>
                    <Input
                      id="checkout-7j9-first-name-dso"
                      placeholder="John"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-last-name-qmb">
                      Last Name
                    </FieldLabel>
                    <Input
                      id="checkout-7j9-last-name-qmb"
                      placeholder="Doe"
                      required
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-email-t33">
                    Email
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-email-t33"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                  />
                  <FieldDescription>
                    We&apos;ll send your receipt to this email
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-address-zgo">
                    Street Address
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-address-zgo"
                    placeholder="123 Main Street"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-address2-d4t">
                    Apartment, suite, etc. (optional)
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-address2-d4t"
                    placeholder="Apartment 4B"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Field className="sm:col-span-2">
                    <FieldLabel htmlFor="checkout-7j9-city-poj">
                      City
                    </FieldLabel>
                    <Input
                      id="checkout-7j9-city-poj"
                      placeholder="New York"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-state-psg">
                      State
                    </FieldLabel>
                    <Select defaultValue="">
                      <SelectTrigger id="checkout-7j9-state-psg">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ca">CA</SelectItem>
                        <SelectItem value="ny">NY</SelectItem>
                        <SelectItem value="tx">TX</SelectItem>
                        <SelectItem value="fl">FL</SelectItem>
                        <SelectItem value="wa">WA</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-zip">ZIP Code</FieldLabel>
                    <Input id="checkout-7j9-zip" placeholder="10001" required />
                  </Field>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-country-code-fl7">
                      Code
                    </FieldLabel>
                    <Select defaultValue="us">
                      <SelectTrigger id="checkout-7j9-country-code-fl7">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">+1</SelectItem>
                        <SelectItem value="uk">+44</SelectItem>
                        <SelectItem value="ca">+1</SelectItem>
                        <SelectItem value="au">+61</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field className="col-span-3">
                    <FieldLabel htmlFor="checkout-7j9-phone-g63">
                      Phone Number
                    </FieldLabel>
                    <Input
                      id="checkout-7j9-phone-g63"
                      type="tel"
                      placeholder="(555) 123-4567"
                      required
                    />
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Payment Method</FieldLegend>
              <FieldDescription>
                All transactions are secure and encrypted
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                    Name on Card
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-card-name-43j"
                    placeholder="John Doe"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                    Card Number
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-card-number-uw1"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                  <FieldDescription>
                    Enter your 16-digit card number
                  </FieldDescription>
                </Field>
                <div className="grid grid-cols-3 gap-4">
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-exp-month-ts6">
                      Month
                    </FieldLabel>
                    <Select defaultValue="">
                      <SelectTrigger id="checkout-7j9-exp-month-ts6">
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="01">01</SelectItem>
                        <SelectItem value="02">02</SelectItem>
                        <SelectItem value="03">03</SelectItem>
                        <SelectItem value="04">04</SelectItem>
                        <SelectItem value="05">05</SelectItem>
                        <SelectItem value="06">06</SelectItem>
                        <SelectItem value="07">07</SelectItem>
                        <SelectItem value="08">08</SelectItem>
                        <SelectItem value="09">09</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="11">11</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-exp-year-f59">
                      Year
                    </FieldLabel>
                    <Select defaultValue="">
                      <SelectTrigger id="checkout-7j9-exp-year-f59">
                        <SelectValue placeholder="YYYY" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2027">2027</SelectItem>
                        <SelectItem value="2028">2028</SelectItem>
                        <SelectItem value="2029">2029</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-cvv">CVV</FieldLabel>
                    <Input id="checkout-7j9-cvv" placeholder="123" required />
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Billing Address</FieldLegend>
              <FieldDescription>
                The billing address associated with your payment method
              </FieldDescription>
              <FieldGroup>
                <Field orientation="horizontal">
                  <Checkbox
                    id="checkout-7j9-same-as-shipping-wgm"
                    defaultChecked
                  />
                  <FieldLabel
                    htmlFor="checkout-7j9-same-as-shipping-wgm"
                    className="font-normal"
                  >
                    Same as shipping address
                  </FieldLabel>
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Additional Options</FieldLegend>
              <FieldDescription>
                Choose how you&apos;d like us to stay in touch
              </FieldDescription>
              <FieldGroup className="gap-3">
                <Field orientation="horizontal">
                  <Checkbox id="checkout-7j9-save-info-zdo" />
                  <FieldLabel
                    htmlFor="checkout-7j9-save-info-zdo"
                    className="font-normal"
                  >
                    Save my information for faster checkout next time
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="checkout-7j9-newsletter-6yv" />
                  <FieldLabel
                    htmlFor="checkout-7j9-newsletter-6yv"
                    className="font-normal"
                  >
                    Email me with news and offers
                  </FieldLabel>
                </Field>
              </FieldGroup>
            </FieldSet>
            <Field>
              <Button type="submit" className="flex-1">
                Complete Order
              </Button>
              <Button variant="outline" className="flex-1">
                Return to Cart
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
