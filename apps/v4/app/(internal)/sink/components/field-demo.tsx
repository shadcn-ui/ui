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
    <>
      <RandomFields />
      <div className="bg-muted flex flex-wrap items-start gap-5 p-4 *:[div]:w-md">
        <div className="flex flex-col gap-6">
          <FormInputDemo />
          <FormInputTypesDemo />
          <FeedbackForm />
          <JobApplicationForm />
          <CheckoutForm />
        </div>

        <div className="flex flex-col gap-6">
          <FormSpecialInputTypesDemo />
          <FormTextareaDemo />
          <FormSelectDemo />
          <ProfileSettingsForm />
          <FormFieldGroupOutlineDemo />
        </div>
        <div className="flex flex-col gap-6">
          <FormRadioDemo />
          <FormCheckboxDemo />
          <FormSliderDemo />
          <NewsletterForm />
          <PaymentForm />
          <ContactForm />
        </div>
        <div className="flex flex-col gap-6">
          <FormSwitchDemo />
          <FormToggleGroupDemo />
          <FormOTPDemo />
          <FormFieldSetDemo />
          <FormFieldSeparatorDemo />
        </div>
        <div className="flex flex-col gap-6">
          <FormDatePickerDemo />
          <SignupForm />
          <LoginForm />
          <FinderPreferencesForm />
          <SurveyForm />
        </div>
        <div className="flex flex-col gap-6">
          <ComplexFormDemo />
          <ComplexFormInvalidDemo />
        </div>
      </div>
    </>
  )
}

function RandomFields() {
  return (
    <div className="bg-muted flex flex-wrap items-start gap-5 p-4 *:[div]:w-md">
      <Card>
        <CardContent>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <FieldDescription>
                  Enter your name so it is long enough to test the layout.
                </FieldDescription>
                <Input id="name" type="text" />
              </Field>
              <Field>
                <FieldLabel htmlFor="name-2">Name</FieldLabel>
                <Input id="name-2" type="text" />
                <FieldDescription>
                  Enter your name so it is long enough to test the layout.
                </FieldDescription>
              </Field>
              <Field>
                <Checkbox id="terms-21f" />
                <FieldLabel htmlFor="terms-21f">
                  Accept terms and conditions
                </FieldLabel>
              </Field>
              <Field>
                <FieldLabel htmlFor="terms-21f">
                  Accept terms and conditions
                </FieldLabel>
                <Checkbox id="terms-21f" />
              </Field>
              <Field>
                <FieldLabel htmlFor="dark-mode">Dark Mode</FieldLabel>
                <Switch id="dark-mode" />
              </Field>
              <RadioGroup>
                <Field>
                  <FieldLabel htmlFor="dark-mode-22">Dark Mode</FieldLabel>
                  <RadioGroupItem value="dark-mode-22" id="dark-mode-22" />
                </Field>
              </RadioGroup>
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="enable-touch-id">
                    Enable Touch ID
                  </FieldLabel>
                  <FieldDescription>
                    Enable Touch ID to quickly unlock your device.
                  </FieldDescription>
                </FieldContent>
                <Checkbox id="enable-touch-id" />
              </Field>
              <FieldSeparator />
              <Field>
                <FieldLabel htmlFor="battery-level">Battery Level</FieldLabel>
                <FieldDescription>
                  Choose your preferred battery level.
                </FieldDescription>
                <RadioGroup>
                  <Field>
                    <RadioGroupItem value="high" id="battery-level-high" />
                    <FieldLabel htmlFor="battery-level-high">High</FieldLabel>
                  </Field>
                  <Field>
                    <RadioGroupItem value="medium" id="battery-level-medium" />
                    <FieldLabel htmlFor="battery-level-medium">
                      Medium
                    </FieldLabel>
                  </Field>
                  <Field>
                    <RadioGroupItem value="low" id="battery-level-low" />
                    <FieldLabel htmlFor="battery-level-low">Low</FieldLabel>
                  </Field>
                </RadioGroup>
              </Field>
              <FieldSeparator />
              <Field>
                <FieldLabel htmlFor="search-results">Search Results</FieldLabel>
                <FieldDescription>
                  Only selected categories will appear in search results.
                </FieldDescription>
                <Field>
                  <Checkbox id="search-results-application" />
                  <FieldLabel htmlFor="search-results-application">
                    Application
                  </FieldLabel>
                </Field>
                <Field>
                  <Checkbox id="search-results-music" />
                  <FieldLabel htmlFor="search-results-music">Music</FieldLabel>
                </Field>
                <Field>
                  <Checkbox id="search-results-video" />
                  <FieldLabel htmlFor="search-results-video">Video</FieldLabel>
                </Field>
                <Field>
                  <Checkbox id="search-results-photo" />
                  <FieldLabel htmlFor="search-results-photo">Photo</FieldLabel>
                </Field>
                <Field>
                  <Checkbox id="search-results-document" />
                  <FieldLabel htmlFor="search-results-document">
                    Document
                  </FieldLabel>
                </Field>
                <Field>
                  <Checkbox id="search-results-other" />
                  <FieldLabel htmlFor="search-results-other">Other</FieldLabel>
                </Field>
              </Field>
              <Field>
                <FieldContent>
                  <FieldLabel>Measurement System</FieldLabel>
                  <FieldDescription>
                    Select your preferred measurement system.
                  </FieldDescription>
                </FieldContent>
                <RadioGroup>
                  <FieldLabel htmlFor="metric">
                    <Field>
                      <FieldTitle>Metric</FieldTitle>
                      <RadioGroupItem value="metric" id="metric" />
                    </Field>
                  </FieldLabel>
                  <FieldLabel>
                    <Field>
                      <RadioGroupItem value="imperial" id="imperial" />
                      <FieldTitle>Imperial</FieldTitle>
                    </Field>
                  </FieldLabel>
                  <FieldLabel htmlFor="custom-units">
                    <Field>
                      <FieldTitle>Custom</FieldTitle>
                      <RadioGroupItem value="custom-units" id="custom-units" />
                    </Field>
                  </FieldLabel>
                </RadioGroup>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Subscription Plan</FieldLegend>
              <FieldDescription>
                Choose your subscription plan.
              </FieldDescription>
              <RadioGroup defaultValue="plus">
                <FieldLabel htmlFor="plus">
                  <Field>
                    <FieldContent>
                      <FieldTitle>Plus</FieldTitle>
                      <FieldDescription>
                        For individuals and small teams
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="plus" id="plus" />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="pro">
                  <Field>
                    <FieldContent>
                      <FieldTitle>Pro</FieldTitle>
                      <FieldDescription>
                        For individuals and small teams
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="pro" id="pro" />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="enterprise">
                  <Field>
                    <FieldContent>
                      <FieldTitle>Enterprise</FieldTitle>
                      <FieldDescription>
                        For large teams and enterprises
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="enterprise" id="enterprise" />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="custom-plan">
                  <Field>
                    <FieldContent>
                      <FieldTitle>Custom</FieldTitle>
                      <FieldDescription>
                        For large teams and enterprises
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="custom-plan" id="custom-plan" />
                  </Field>
                </FieldLabel>
              </RadioGroup>
            </FieldSet>
            <FieldSet>
              <FieldLegend>Display Settings</FieldLegend>
              <FieldDescription>Manage your display settings.</FieldDescription>
              <Field>
                <FieldLabel htmlFor="increase-contrast">
                  <Field>
                    <FieldContent>
                      <FieldTitle>Increase Contrast</FieldTitle>
                      <FieldDescription>
                        Increase the contrast of the UI to make it easier to
                        read.
                      </FieldDescription>
                    </FieldContent>
                    <Switch id="increase-contrast" />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="reduce-transparency">
                  <Field>
                    <FieldContent>
                      <FieldTitle>Reduce Transparency</FieldTitle>
                      <FieldDescription>
                        Reduce the transparency of the UI to make it easier to
                        read.
                      </FieldDescription>
                    </FieldContent>
                    <Switch id="reduce-transparency" />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="reduce-motion">
                  <Field>
                    <FieldContent>
                      <FieldTitle>Reduce Motion</FieldTitle>
                      <FieldDescription>
                        Reduce motion of the UI to make it easier to read.
                      </FieldDescription>
                    </FieldContent>
                    <Switch id="reduce-motion" />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="enable-dark-mode">
                  <Field>
                    <FieldContent>
                      <FieldTitle>Enable Dark Mode</FieldTitle>
                      <FieldDescription>
                        Enable dark mode to make the UI easier to read.
                      </FieldDescription>
                    </FieldContent>
                    <Switch id="enable-dark-mode" />
                  </Field>
                </FieldLabel>
              </Field>
              <Field>
                <FieldLabel>Display Resolution</FieldLabel>
                <FieldDescription>
                  Select your preferred display resolution.
                </FieldDescription>
                <RadioGroup className="grid grid-cols-2 gap-2">
                  <FieldLabel htmlFor="1080p">
                    <Field>
                      <RadioGroupItem value="1080p" id="1080p" />
                      <FieldTitle>1920x1080</FieldTitle>
                    </Field>
                  </FieldLabel>
                  <FieldLabel htmlFor="1440p">
                    <Field>
                      <RadioGroupItem value="1440p" id="1440p" />
                      <FieldTitle>2560x1440</FieldTitle>
                    </Field>
                  </FieldLabel>
                  <FieldLabel htmlFor="4k">
                    <Field>
                      <RadioGroupItem value="4k" id="4k" />
                      <FieldContent>
                        <FieldTitle>3840x2160</FieldTitle>
                        <FieldDescription>
                          This is a description for the 4k option.
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                  <FieldLabel htmlFor="8k">
                    <Field>
                      <RadioGroupItem value="8k" id="8k" />
                      <FieldTitle>7680x4320</FieldTitle>
                    </Field>
                  </FieldLabel>
                </RadioGroup>
              </Field>
            </FieldSet>
          </FieldGroup>
        </CardContent>
      </Card>
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
              <FieldLabel htmlFor="everyone">
                <Field>
                  <FieldContent>
                    <FieldTitle>Everyone</FieldTitle>
                    <FieldDescription>
                      Anyone can see your profile.
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem
                    value="everyone"
                    id="everyone"
                    className="sr-only"
                  />
                  <IconCircle className="stroke-input size-5 stroke-1 group-has-data-[state=checked]/field:hidden" />
                  <IconCircleCheckFilled className="fill-primary hidden size-5 group-has-data-[state=checked]/field:block" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="followers">
                <Field>
                  <FieldContent>
                    <FieldTitle>Followers</FieldTitle>
                    <FieldDescription>
                      Visible to your followers and connections.
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem
                    value="followers"
                    id="followers"
                    className="sr-only"
                  />
                  <IconCircle className="stroke-input size-5 stroke-1 group-has-data-[state=checked]/field:hidden" />
                  <IconCircleCheckFilled className="fill-primary hidden size-5 group-has-data-[state=checked]/field:block" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="custom">
                <Field>
                  <FieldContent>
                    <FieldTitle>Custom</FieldTitle>
                    <FieldDescription>
                      Choose who can see your profile.
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem
                    value="custom"
                    id="custom"
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
              <FieldLabel htmlFor="everyone">
                <Field>
                  <RadioGroupItem value="everyone" id="everyone" />
                  <FieldContent>
                    <FieldTitle>Everyone</FieldTitle>
                    <FieldDescription>
                      Anyone can see your profile.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="followers">
                <Field>
                  <RadioGroupItem value="followers" id="followers" />
                  <FieldContent>
                    <FieldTitle>Followers</FieldTitle>
                    <FieldDescription>
                      Visible to your followers and connections.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="custom">
                <Field>
                  <RadioGroupItem value="custom" id="custom" />
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
              <FieldLabel htmlFor="everyone-3">
                <Field>
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
                    id="everyone-3"
                    className="sr-only"
                  />
                  <IconCircle className="stroke-input size-5 stroke-1 group-has-data-[state=checked]/field:hidden" />
                  <IconCircleCheckFilled className="fill-primary hidden size-5 group-has-data-[state=checked]/field:block" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="followers-3">
                <Field>
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
                    id="followers-3"
                    className="sr-only"
                  />
                  <IconCircle className="stroke-input size-5 stroke-1 group-has-data-[state=checked]/field:hidden" />
                  <IconCircleCheckFilled className="fill-primary hidden size-5 group-has-data-[state=checked]/field:block" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="custom-3">
                <Field>
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
                    id="custom-3"
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
      <Card>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel>How did you hear about us?</FieldLabel>
                <FieldDescription>
                  Select the option that best describes how you heard about us.
                </FieldDescription>
                <FieldGroup className="flex flex-row flex-wrap gap-2 [--radius:9999rem] **:data-[slot=checkbox]:rounded-full **:data-[slot=field]:gap-2 **:data-[slot=field]:overflow-hidden **:data-[slot=field]:px-2.5 **:data-[slot=field]:py-2 *:data-[slot=field-label]:w-fit">
                  <FieldLabel htmlFor="social-media">
                    <Field>
                      <Checkbox
                        value="social-media"
                        id="social-media"
                        className="-ml-6 -translate-x-1 transition-all duration-100 group-has-data-[state=checked]/field-label:ml-0 group-has-data-[state=checked]/field-label:translate-x-0"
                      />
                      <FieldTitle>Social Media</FieldTitle>
                    </Field>
                  </FieldLabel>
                  <FieldLabel htmlFor="search-engine">
                    <Field>
                      <Checkbox
                        value="search-engine"
                        id="search-engine"
                        className="-ml-6 -translate-x-1 transition-all duration-100 group-has-data-[state=checked]/field-label:ml-0 group-has-data-[state=checked]/field-label:translate-x-0"
                      />
                      <FieldTitle>Search Engine</FieldTitle>
                    </Field>
                  </FieldLabel>
                  <FieldLabel htmlFor="referral">
                    <Field>
                      <Checkbox
                        value="referral"
                        id="referral"
                        className="-ml-6 -translate-x-1 transition-all duration-100 group-has-data-[state=checked]/field-label:ml-0 group-has-data-[state=checked]/field-label:translate-x-0"
                      />
                      <FieldTitle>Referral</FieldTitle>
                    </Field>
                  </FieldLabel>
                  <FieldLabel htmlFor="other">
                    <Field>
                      <Checkbox
                        value="other"
                        id="other"
                        className="-ml-6 -translate-x-1 transition-all duration-100 group-has-data-[state=checked]/field-label:ml-0 group-has-data-[state=checked]/field-label:translate-x-0"
                      />
                      <FieldTitle>Other (Please specify)</FieldTitle>
                    </Field>
                  </FieldLabel>
                </FieldGroup>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Field>
            <FieldLabel>Shipping Method</FieldLabel>
            <FieldDescription>
              Select the shipping method for your order.
            </FieldDescription>
            <RadioGroup className="[--spacing:0.2rem]">
              <FieldLabel htmlFor="pickup">
                <Field>
                  <RadioGroupItem value="pickup" id="pickup" />
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
              <FieldLabel htmlFor="delivery">
                <Field>
                  <RadioGroupItem value="delivery" id="delivery" />
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
              <FieldLabel htmlFor="express">
                <Field>
                  <RadioGroupItem value="express" id="express" />
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
          </Field>
        </CardContent>
      </Card>
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
              <Field>
                <FieldLabel htmlFor="gpu-type">GPU Type</FieldLabel>
                <FieldDescription>
                  Select the GPU type for your cluster.
                </FieldDescription>
                <RadioGroup defaultValue="h100">
                  <FieldLabel htmlFor="h100">
                    <Field>
                      <RadioGroupItem value="h100" id="h100" />
                      <FieldContent>
                        <FieldTitle>NVIDIA H100</FieldTitle>
                        <FieldDescription>SXM5 80GB VRAM</FieldDescription>
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                  <FieldLabel htmlFor="h200">
                    <Field>
                      <RadioGroupItem value="h200" id="h200" />
                      <FieldContent>
                        <FieldTitle>NVIDIA H200</FieldTitle>
                        <FieldDescription>SXM5 141GB VRAM</FieldDescription>
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                </RadioGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="compute-environment">
                  Compute Environment
                </FieldLabel>
                <RadioGroup defaultValue="kubernetes">
                  <FieldLabel htmlFor="kubernetes">
                    <Field>
                      <RadioGroupItem value="kubernetes" id="kubernetes" />
                      <FieldContent>
                        <FieldTitle>Kubernetes</FieldTitle>
                        <FieldDescription>
                          Run GPU workloads on a K8s configured cluster.
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                  <FieldLabel htmlFor="vm">
                    <Field>
                      <RadioGroupItem value="vm" id="vm" />
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
                <FieldLabel htmlFor="number-of-gpus">Number of GPUs</FieldLabel>
                <FieldDescription>
                  Buy a single node with 8 GPUs or many interconnected nodes.
                  You can add more GPUs later.
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
                  <FieldLabel htmlFor="today">
                    <Field>
                      <RadioGroupItem value="today" id="today" />
                      <FieldContent>
                        <FieldTitle>Start cluster now</FieldTitle>
                        <FieldDescription>
                          Your cluster will be ready to use immediately.
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                  <FieldLabel htmlFor="scheduled">
                    <Field>
                      <RadioGroupItem value="scheduled" id="scheduled" />
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
                <FieldLabel htmlFor="duration">Duration</FieldLabel>
                <FieldDescription>
                  You can add more time later.
                </FieldDescription>
                <ButtonGroup>
                  <Input />
                  <Select defaultValue="hours">
                    <SelectTrigger id="duration" className="w-24">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </ButtonGroup>
              </Field>
              <Field>
                <Button type="submit">Get Instant Quote</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <div>
        <form>
          <FieldGroup
            variant="outline"
            className="*:data-[slot=field-separator]:-mx-6"
          >
            <Field>
              <FieldLabel htmlFor="gpu-type">GPU Type</FieldLabel>
              <FieldDescription>
                Select the GPU type for your cluster.
              </FieldDescription>
              <RadioGroup defaultValue="h100">
                <FieldLabel htmlFor="h100">
                  <Field>
                    <RadioGroupItem value="h100" id="h100" />
                    <FieldContent>
                      <FieldTitle>NVIDIA H100</FieldTitle>
                      <FieldDescription>SXM5 80GB VRAM</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="h200">
                  <Field>
                    <RadioGroupItem value="h200" id="h200" />
                    <FieldContent>
                      <FieldTitle>NVIDIA H200</FieldTitle>
                      <FieldDescription>SXM5 141GB VRAM</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              </RadioGroup>
            </Field>
            <FieldSeparator />
            <Field>
              <FieldLabel htmlFor="compute-environment">
                Compute Environment
              </FieldLabel>
              <FieldDescription>
                Select the compute environment for your cluster.
              </FieldDescription>
              <RadioGroup defaultValue="kubernetes">
                <FieldLabel htmlFor="kubernetes">
                  <Field>
                    <RadioGroupItem value="kubernetes" id="kubernetes" />
                    <FieldContent>
                      <FieldTitle>Kubernetes</FieldTitle>
                      <FieldDescription>
                        Run GPU workloads on a K8s configured cluster.
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="vm">
                  <Field>
                    <RadioGroupItem value="vm" id="vm" />
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
            <FieldSeparator />
            <Field>
              <FieldLabel htmlFor="number-of-gpus">Number of GPUs</FieldLabel>
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
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Starting date</FieldLegend>
              <FieldDescription>
                When you want to start your cluster.
              </FieldDescription>
              <RadioGroup defaultValue="today">
                <FieldLabel htmlFor="today">
                  <Field>
                    <RadioGroupItem value="today" id="today" />
                    <FieldContent>
                      <FieldTitle>Start cluster now</FieldTitle>
                      <FieldDescription>
                        Your cluster will be ready to use immediately.
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="scheduled">
                  <Field>
                    <RadioGroupItem value="scheduled" id="scheduled" />
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
            <FieldSeparator />
            <Field>
              <FieldLabel htmlFor="duration">Duration</FieldLabel>
              <FieldDescription>You can add more time later.</FieldDescription>
              <ButtonGroup>
                <Input />
                <Select defaultValue="hours">
                  <SelectTrigger id="duration" className="w-24">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                  </SelectContent>
                </Select>
              </ButtonGroup>
            </Field>
            <Field>
              <Button type="submit">Get Instant Quote</Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
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
              <FieldLabel htmlFor="signup-name">Full Name</FieldLabel>
              <Input
                id="signup-name"
                type="text"
                placeholder="John Doe"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="signup-email">Email</FieldLabel>
              <Input
                id="signup-email"
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
              <FieldLabel htmlFor="signup-password">Password</FieldLabel>
              <Input id="signup-password" type="password" required />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="signup-confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="signup-confirm-password" type="password" required />
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
              <FieldLabel htmlFor="login-7x9-email">Email</FieldLabel>
              <Input
                id="login-7x9-email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="login-7x9-password">Password</FieldLabel>
              <Input id="login-7x9-password" type="password" required />
              <FieldDescription>
                <a href="#" className="text-sm underline underline-offset-4">
                  Forgot your password?
                </a>
              </FieldDescription>
            </Field>
            <Field>
              <Checkbox id="login-7x9-remember" />
              <FieldContent>
                <FieldLabel
                  htmlFor="login-7x9-remember"
                  className="font-normal"
                >
                  Remember me for 30 days
                </FieldLabel>
              </FieldContent>
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
              <Field>
                <Checkbox id="finder-pref-9k2-hard-disks" />
                <FieldContent>
                  <FieldLabel
                    htmlFor="finder-pref-9k2-hard-disks"
                    className="font-normal"
                  >
                    Hard disks
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <Checkbox id="finder-pref-9k2-external-disks" />
                <FieldContent>
                  <FieldLabel
                    htmlFor="finder-pref-9k2-external-disks"
                    className="font-normal"
                  >
                    External disks
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <Checkbox id="finder-pref-9k2-cds-dvds" />
                <FieldContent>
                  <FieldLabel
                    htmlFor="finder-pref-9k2-cds-dvds"
                    className="font-normal"
                  >
                    CDs, DVDs, and iPods
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <Checkbox id="finder-pref-9k2-connected-servers" />
                <FieldContent>
                  <FieldLabel
                    htmlFor="finder-pref-9k2-connected-servers"
                    className="font-normal"
                  >
                    Connected servers
                  </FieldLabel>
                </FieldContent>
              </Field>
            </Field>
            <FieldSeparator />
            <Field>
              <FieldLabel>New Finder windows show:</FieldLabel>
              <Select defaultValue="home">
                <SelectTrigger id="finder-pref-9k2-new-window">
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
                <Input placeholder="Select location" />
                <InputGroupAddon>
                  <IconInfoCircle />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <FieldSeparator />
            <Field>
              <Checkbox id="finder-pref-9k2-sync-folders" defaultChecked />
              <FieldContent>
                <FieldLabel
                  htmlFor="finder-pref-9k2-sync-folders"
                  className="font-normal"
                >
                  Sync Desktop & Documents folders
                </FieldLabel>
                <FieldDescription>
                  Your Desktop & Documents folders are being synced with iCloud
                  Drive. You can access them from other devices.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field>
              <Checkbox id="finder-pref-9k2-open-tabs" defaultChecked />
              <FieldContent>
                <FieldLabel
                  htmlFor="finder-pref-9k2-open-tabs"
                  className="font-normal"
                >
                  Open folders in tabs instead of new windows
                </FieldLabel>
              </FieldContent>
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
                <FieldLabel htmlFor="contact-3k1-firstName">
                  First Name
                </FieldLabel>
                <Input id="contact-3k1-firstName" placeholder="John" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="contact-3k2-lastName">
                  Last Name
                </FieldLabel>
                <Input id="contact-3k2-lastName" placeholder="Doe" required />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="contact-3k2-email">Email</FieldLabel>
              <Input
                id="contact-3k2-email"
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
              <FieldLabel htmlFor="subject">Subject</FieldLabel>
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
              <FieldLabel htmlFor="contact-3k2-message">Message</FieldLabel>
              <Textarea
                id="contact-3k2-message"
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
              <FieldLabel htmlFor="feedback-8m4-name">
                Name (Optional)
              </FieldLabel>
              <Input id="feedback-8m4-name" placeholder="Your name" />
              <FieldDescription>Your name is optional.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="feedback-8m4-email">
                Email (Optional)
              </FieldLabel>
              <Input
                id="feedback-8m4-email"
                type="email"
                placeholder="your@email.com"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="feedback-8m4-rating">
                How would you rate your experience?
              </FieldLabel>
              <Slider
                value={rating}
                onValueChange={setRating}
                max={10}
                min={1}
                step={1}
                id="feedback-8m4-rating"
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
                <Field>
                  <RadioGroupItem value="bug" id="feedback-8m4-bug" />
                  <FieldContent>
                    <FieldLabel
                      htmlFor="feedback-8m4-bug"
                      className="font-normal"
                    >
                      Bug Report
                    </FieldLabel>
                  </FieldContent>
                </Field>
                <Field>
                  <RadioGroupItem value="feature" id="feedback-8m4-feature" />
                  <FieldContent>
                    <FieldLabel
                      htmlFor="feedback-8m4-feature"
                      className="font-normal"
                    >
                      Feature Request
                    </FieldLabel>
                  </FieldContent>
                </Field>
                <Field>
                  <RadioGroupItem value="general" id="feedback-8m4-general" />
                  <FieldContent>
                    <FieldLabel
                      htmlFor="feedback-8m4-general"
                      className="font-normal"
                    >
                      General Feedback
                    </FieldLabel>
                  </FieldContent>
                </Field>
                <Field>
                  <RadioGroupItem
                    value="complaint"
                    id="feedback-8m4-complaint"
                  />
                  <FieldContent>
                    <FieldLabel
                      htmlFor="feedback-8m4-complaint"
                      className="font-normal"
                    >
                      Complaint
                    </FieldLabel>
                  </FieldContent>
                </Field>
              </RadioGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="feedback-8m4-message">
                Your Feedback
              </FieldLabel>
              <Textarea
                id="feedback-8m4-message"
                placeholder="Please share your thoughts, suggestions, or report any issues..."
                className="min-h-[120px]"
                required
              />
              <FieldDescription>
                Please share your thoughts, suggestions, or report any issues...
              </FieldDescription>
            </Field>
            <Field>
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
                <FieldLabel htmlFor="job-5p7-firstName">First Name</FieldLabel>
                <Input id="job-5p7-firstName" placeholder="John" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="job-5p7-lastName">Last Name</FieldLabel>
                <Input id="job-5p7-lastName" placeholder="Doe" required />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="job-5p7-email">Email</FieldLabel>
              <Input
                id="job-5p7-email"
                type="email"
                placeholder="john@example.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="job-5p7-phone">Phone Number</FieldLabel>
              <Input
                id="job-5p7-phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="position">Position</FieldLabel>
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
              <FieldLabel htmlFor="experience">Years of Experience</FieldLabel>
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
              <FieldLabel htmlFor="job-5p7-portfolio">
                Portfolio/LinkedIn URL
              </FieldLabel>
              <Input
                id="job-5p7-portfolio"
                type="url"
                placeholder="https://..."
              />
              <FieldDescription>
                Optional: Share your portfolio or professional profile.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="job-5p7-coverLetter">
                Cover Letter
              </FieldLabel>
              <Textarea
                id="job-5p7-coverLetter"
                placeholder="Tell us why you're interested in this position..."
                className="min-h-[120px]"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="job-5p7-resume">Resume</FieldLabel>
              <Input id="job-5p7-resume" type="file" accept=".pdf,.doc,.docx" />
              <FieldDescription>
                Upload your resume in PDF, DOC, or DOCX format (max 5MB).
              </FieldDescription>
            </Field>
            <Field>
              <Checkbox id="job-5p7-terms" required />
              <FieldLabel
                htmlFor="job-5p7-terms"
                className="-mt-0.5 leading-normal font-normal"
              >
                I authorize the company to contact me regarding this application
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
              <FieldLabel htmlFor="newsletter-2q8-name">Name</FieldLabel>
              <Input
                id="newsletter-2q8-name"
                placeholder="Your name"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newsletter-2q8-email">Email</FieldLabel>
              <Input
                id="newsletter-2q8-email"
                type="email"
                placeholder="your@email.com"
                required
              />
              <FieldDescription>
                We&apos;ll send our newsletter to this email address.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Interests (Select all that apply)</FieldLabel>
              <Field>
                <Checkbox id="newsletter-2q8-tech" />
                <FieldContent>
                  <FieldLabel
                    htmlFor="newsletter-2q8-tech"
                    className="font-normal"
                  >
                    Technology News
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <Checkbox id="newsletter-2q8-product" />
                <FieldContent>
                  <FieldLabel
                    htmlFor="newsletter-2q8-product"
                    className="font-normal"
                  >
                    Product Updates
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <Checkbox id="newsletter-2q8-tips" />
                <FieldContent>
                  <FieldLabel
                    htmlFor="newsletter-2q8-tips"
                    className="font-normal"
                  >
                    Tips & Tutorials
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <Checkbox id="newsletter-2q8-events" />
                <FieldContent>
                  <FieldLabel
                    htmlFor="newsletter-2q8-events"
                    className="font-normal"
                  >
                    Events & Webinars
                  </FieldLabel>
                </FieldContent>
              </Field>
            </Field>
            <Field>
              <Checkbox id="newsletter-2q8-privacy" required />
              <FieldContent>
                <FieldLabel
                  htmlFor="newsletter-2q8-privacy"
                  className="-mt-0.5 leading-normal font-normal"
                >
                  I agree to receive marketing emails and understand I can
                  unsubscribe at any time
                </FieldLabel>
              </FieldContent>
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
              <FieldLabel htmlFor="payment-9n3-cardNumber">
                Card Number
              </FieldLabel>
              <Input
                id="payment-9n3-cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="payment-9n3-expiry">
                  Expiry Date
                </FieldLabel>
                <Input
                  id="payment-9n3-expiry"
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
              <FieldLabel htmlFor="payment-9n3-cardName">
                Name on Card
              </FieldLabel>
              <Input id="payment-9n3-cardName" placeholder="John Doe" />
            </Field>

            <Separator />

            <FieldSet>
              <FieldLegend>Billing Address</FieldLegend>
              <FieldDescription>
                Please enter your billing address.
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="payment-9n3-address">Address</FieldLabel>
                  <Input id="payment-9n3-address" placeholder="123 Main St" />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="payment-9n3-city">City</FieldLabel>
                    <Input id="payment-9n3-city" placeholder="New York" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="payment-9n3-zip">ZIP Code</FieldLabel>
                    <Input id="payment-9n3-zip" placeholder="10001" />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="payment-9n3-country">Country</FieldLabel>
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
            <FieldLabel htmlFor="input-1a2-basic">Basic Input</FieldLabel>
            <Input id="input-1a2-basic" placeholder="Enter text" />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-1a2-withDesc">
              Input with Description
            </FieldLabel>
            <Input id="input-1a2-withDesc" placeholder="Enter your username" />
            <FieldDescription>
              Choose a unique username for your account.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="input-1a2-descFirst">Email Address</FieldLabel>
            <FieldDescription>
              We&apos;ll never share your email with anyone.
            </FieldDescription>
            <Input
              id="input-1a2-descFirst"
              type="email"
              placeholder="email@example.com"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-1a2-required">
              Required Field <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="input-1a2-required"
              placeholder="This field is required"
              required
            />
            <FieldDescription>This field must be filled out.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="input-1a2-disabled">Disabled Input</FieldLabel>
            <Input id="input-1a2-disabled" placeholder="Cannot edit" disabled />
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
            <FieldLabel htmlFor="textarea-3b5-basic">Basic Textarea</FieldLabel>
            <Textarea
              id="textarea-3b5-basic"
              placeholder="Enter your message"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="textarea-3b5-comments">Comments</FieldLabel>
            <Textarea
              id="textarea-3b5-comments"
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
            <FieldLabel htmlFor="select-4c6-basic">Basic Select</FieldLabel>
            <Select>
              <SelectTrigger id="select-4c6-basic">
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
            <FieldLabel htmlFor="select-4c6-country">Country</FieldLabel>
            <Select>
              <SelectTrigger id="select-4c6-country">
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
            <FieldLabel htmlFor="select-4c6-timezone">Timezone</FieldLabel>
            <FieldDescription>
              Choose your local timezone for accurate scheduling.
            </FieldDescription>
            <Select>
              <SelectTrigger id="select-4c6-timezone">
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
          <Field>
            <FieldLabel>Subscription Plan</FieldLabel>
            <RadioGroup defaultValue="free">
              <Field>
                <RadioGroupItem value="free" id="free" />
                <FieldContent>
                  <FieldLabel htmlFor="free" className="font-normal">
                    Free Plan
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <RadioGroupItem value="pro" id="pro" />
                <FieldContent>
                  <FieldLabel htmlFor="pro" className="font-normal">
                    Pro Plan
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <RadioGroupItem value="enterprise" id="enterprise" />
                <FieldContent>
                  <FieldLabel htmlFor="enterprise" className="font-normal">
                    Enterprise
                  </FieldLabel>
                </FieldContent>
              </Field>
            </RadioGroup>
          </Field>
          <Field>
            <FieldLabel>Size</FieldLabel>
            <RadioGroup defaultValue="medium" className="flex gap-2">
              <Field>
                <RadioGroupItem value="small" id="size-small" />
                <FieldContent>
                  <FieldLabel htmlFor="size-small" className="font-normal">
                    Small
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <RadioGroupItem value="medium" id="size-medium" />
                <FieldContent>
                  <FieldLabel htmlFor="size-medium" className="font-normal">
                    Medium
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <RadioGroupItem value="large" id="size-large" />
                <FieldContent>
                  <FieldLabel htmlFor="size-large" className="font-normal">
                    Large
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <RadioGroupItem value="xlarge" id="size-xlarge" />
                <FieldContent>
                  <FieldLabel htmlFor="size-xlarge" className="font-normal">
                    X-Large
                  </FieldLabel>
                </FieldContent>
              </Field>
            </RadioGroup>
            <FieldDescription>Select your preferred size.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Notification Preferences</FieldLabel>
            <FieldDescription>
              Choose how you want to receive notifications.
            </FieldDescription>
            <RadioGroup defaultValue="email">
              <Field>
                <RadioGroupItem value="email" id="notify-email" />
                <FieldContent>
                  <FieldLabel htmlFor="notify-email" className="font-normal">
                    Email only
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <RadioGroupItem value="sms" id="notify-sms" />
                <FieldContent>
                  <FieldLabel htmlFor="notify-sms" className="font-normal">
                    SMS only
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <RadioGroupItem value="both" id="notify-both" />
                <FieldContent>
                  <FieldLabel htmlFor="notify-both" className="font-normal">
                    Both Email & SMS
                  </FieldLabel>
                </FieldContent>
              </Field>
            </RadioGroup>
          </Field>
          <Field>
            <FieldLabel>Delivery Speed</FieldLabel>
            <RadioGroup
              defaultValue="standard"
              className="flex flex-wrap gap-4"
            >
              <Field>
                <RadioGroupItem value="express" id="delivery-express" />
                <FieldContent>
                  <FieldLabel
                    htmlFor="delivery-express"
                    className="font-normal"
                  >
                    Express (1-2 days)
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <RadioGroupItem value="standard" id="delivery-standard" />
                <FieldContent>
                  <FieldLabel
                    htmlFor="delivery-standard"
                    className="font-normal"
                  >
                    Standard (3-5 days)
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <RadioGroupItem value="economy" id="delivery-economy" />
                <FieldContent>
                  <FieldLabel
                    htmlFor="delivery-economy"
                    className="font-normal"
                  >
                    Economy (5-7 days)
                  </FieldLabel>
                </FieldContent>
              </Field>
            </RadioGroup>
          </Field>
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
          <Field>
            <Checkbox id="terms" />
            <FieldContent>
              <FieldLabel htmlFor="terms" className="font-normal">
                I agree to the terms and conditions
              </FieldLabel>
            </FieldContent>
          </Field>

          <Field>
            <Checkbox id="newsletter" />
            <FieldContent>
              <FieldLabel htmlFor="newsletter">
                Subscribe to newsletter
              </FieldLabel>
              <FieldDescription>
                Receive weekly updates about new features and promotions.
              </FieldDescription>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Preferences</FieldLabel>
            <FieldDescription>
              Select all that apply to customize your experience.
            </FieldDescription>
            <Field>
              <Checkbox id="pref-dark" />
              <FieldContent>
                <FieldLabel htmlFor="pref-dark" className="font-normal">
                  Dark mode
                </FieldLabel>
              </FieldContent>
            </Field>
            <Field>
              <Checkbox id="pref-compact" />
              <FieldContent>
                <FieldLabel htmlFor="pref-compact" className="font-normal">
                  Compact view
                </FieldLabel>
              </FieldContent>
            </Field>
            <Field>
              <Checkbox id="pref-notifications" />
              <FieldContent>
                <FieldLabel
                  htmlFor="pref-notifications"
                  className="font-normal"
                >
                  Enable notifications
                </FieldLabel>
              </FieldContent>
            </Field>
          </Field>
          <Field>
            <FieldLabel>Days Available</FieldLabel>
            <FieldDescription>
              Select the days you are available.
            </FieldDescription>
            <Field>
              <Field>
                <Checkbox id="mon" />
                <FieldContent>
                  <FieldLabel htmlFor="mon" className="font-normal">
                    Mon
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <Checkbox id="tue" />
                <FieldContent>
                  <FieldLabel htmlFor="tue" className="font-normal">
                    Tue
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <Checkbox id="wed" />
                <FieldContent>
                  <FieldLabel htmlFor="wed" className="font-normal">
                    Wed
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <Checkbox id="thu" />
                <FieldContent>
                  <FieldLabel htmlFor="thu" className="font-normal">
                    Thu
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <Checkbox id="fri" />
                <FieldContent>
                  <FieldLabel htmlFor="fri" className="font-normal">
                    Fri
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <Checkbox id="sat" />
                <FieldContent>
                  <FieldLabel htmlFor="sat" className="font-normal">
                    Sat
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <Checkbox id="sun" />
                <FieldContent>
                  <FieldLabel htmlFor="sun" className="font-normal">
                    Sun
                  </FieldLabel>
                </FieldContent>
              </Field>
            </Field>
          </Field>
          <Field>
            <FieldLabel>Skills</FieldLabel>
            <Field className="flex-wrap">
              <Field>
                <Checkbox id="javascript" />
                <FieldContent>
                  <FieldLabel htmlFor="javascript" className="font-normal">
                    JavaScript
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <Checkbox id="typescript" />
                <FieldContent>
                  <FieldLabel htmlFor="typescript" className="font-normal">
                    TypeScript
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <Checkbox id="react" />
                <FieldContent>
                  <FieldLabel htmlFor="react" className="font-normal">
                    React
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <Checkbox id="nodejs" />
                <FieldContent>
                  <FieldLabel htmlFor="nodejs" className="font-normal">
                    Node.js
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <Checkbox id="python" />
                <FieldContent>
                  <FieldLabel htmlFor="python" className="font-normal">
                    Python
                  </FieldLabel>
                </FieldContent>
              </Field>
              <Field>
                <Checkbox id="database" />
                <FieldContent>
                  <FieldLabel htmlFor="database" className="font-normal">
                    Database
                  </FieldLabel>
                </FieldContent>
              </Field>
            </Field>
            <FieldDescription>
              Select all technologies you are proficient with.
            </FieldDescription>
          </Field>
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
            <FieldLabel htmlFor="volume">Volume</FieldLabel>
            <Slider
              id="volume"
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="brightness">Screen Brightness</FieldLabel>
            <Slider
              id="brightness"
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
            <FieldLabel htmlFor="quality">Video Quality</FieldLabel>
            <FieldDescription>
              Higher quality uses more bandwidth.
            </FieldDescription>
            <Slider
              id="quality"
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
          <Field>
            <FieldContent>
              <FieldLabel htmlFor="airplane-mode">Airplane Mode</FieldLabel>
              <FieldDescription>
                Turn on airplane mode to disable all connections.
              </FieldDescription>
            </FieldContent>
            <Switch id="airplane-mode" />
          </Field>
          <Field>
            <FieldContent>
              <FieldLabel htmlFor="notifications">
                Push Notifications
              </FieldLabel>
              <FieldDescription>
                Receive notifications about updates and new features.
              </FieldDescription>
            </FieldContent>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </Field>
          <Field>
            <Switch
              id="marketing"
              checked={marketing}
              onCheckedChange={setMarketing}
              className="mt-0.5"
            />
            <FieldContent>
              <FieldLabel htmlFor="marketing">Marketing Emails</FieldLabel>
              <FieldDescription>
                Receive emails about new products, features, and more.
              </FieldDescription>
            </FieldContent>
          </Field>
          <Field>
            <Switch id="auto-save" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="auto-save">Auto-save</FieldLabel>
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
            <Field>
              <Switch id="profile-visible" defaultChecked />
              <FieldContent>
                <FieldLabel htmlFor="profile-visible" className="font-normal">
                  Make profile visible to others
                </FieldLabel>
              </FieldContent>
            </Field>
            <Field>
              <Switch id="show-email" />
              <FieldContent>
                <FieldLabel htmlFor="show-email" className="font-normal">
                  Show email on profile
                </FieldLabel>
              </FieldContent>
            </Field>
            <Field>
              <Switch id="allow-indexing" defaultChecked />
              <FieldContent>
                <FieldLabel htmlFor="allow-indexing" className="font-normal">
                  Allow search engines to index profile
                </FieldLabel>
              </FieldContent>
            </Field>
          </Field>
          <Field>
            <Switch id="disabled-switch" disabled />
            <FieldContent>
              <FieldLabel htmlFor="disabled-switch" className="opacity-50">
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
              <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
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
            <FieldLabel htmlFor="text-input">Text</FieldLabel>
            <Input id="text-input" type="text" placeholder="Enter text" />
            <FieldDescription>Standard text input field.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="email-input">Email</FieldLabel>
            <Input
              id="email-input"
              type="email"
              placeholder="name@example.com"
            />
            <FieldDescription>Email address with validation.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="password-input">Password</FieldLabel>
            <Input
              id="password-input"
              type="password"
              placeholder="Enter password"
            />
            <FieldDescription>
              Password field with hidden text.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="tel-input">Phone</FieldLabel>
            <Input id="tel-input" type="tel" placeholder="+1 (555) 123-4567" />
            <FieldDescription>Telephone number input.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="url-input">URL</FieldLabel>
            <Input
              id="url-input"
              type="url"
              placeholder="https://example.com"
            />
            <FieldDescription>Website URL with validation.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="search-input">Search</FieldLabel>
            <Input id="search-input" type="search" placeholder="Search..." />
            <FieldDescription>Search field with clear button.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="number-input">Number</FieldLabel>
            <Input
              id="number-input"
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
            <FieldLabel htmlFor="date-input">Date</FieldLabel>
            <Input id="date-input" type="date" />
            <FieldDescription>Native date picker.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="time-input">Time</FieldLabel>
            <Input id="time-input" type="time" />
            <FieldDescription>
              Time selection (24-hour format).
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="datetime-input">Date & Time</FieldLabel>
            <Input id="datetime-input" type="datetime-local" />
            <FieldDescription>Combined date and time picker.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="month-input">Month</FieldLabel>
            <Input id="month-input" type="month" />
            <FieldDescription>Month and year selector.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="week-input">Week</FieldLabel>
            <Input id="week-input" type="week" />
            <FieldDescription>Week number selector.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="file-input">File Upload</FieldLabel>
            <Input id="file-input" type="file" accept="image/*,.pdf" />
            <FieldDescription>Upload images or PDF files.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="files-input">Multiple Files</FieldLabel>
            <Input
              id="files-input"
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
            <FieldLabel htmlFor="otp-with-desc">Enter OTP</FieldLabel>
            <InputOTP
              id="otp-with-desc"
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
            <FieldLabel htmlFor="otp-separator">
              Two-Factor Authentication
            </FieldLabel>
            <InputOTP id="otp-separator" maxLength={6}>
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
            <FieldLabel htmlFor="pin-input">PIN Code</FieldLabel>
            <InputOTP
              id="pin-input"
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
            <FieldLabel htmlFor="otp-custom">Security Code</FieldLabel>
            <FieldDescription>
              Enter the security code to continue.
            </FieldDescription>
            <InputOTP id="otp-custom" maxLength={6}>
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
          <Field>
            <FieldLabel htmlFor="basic-date">Select Date</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="basic-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </Field>
          <Field>
            <FieldLabel htmlFor="birth-date">Date of Birth</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="birth-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
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
            <FieldLabel htmlFor="appointment">Appointment Date</FieldLabel>
            <FieldDescription>
              Select a date for your appointment (weekdays only).
            </FieldDescription>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="appointment"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !appointmentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
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
            <FieldLabel htmlFor="date-range">Date Range</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-range"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
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
            <FieldLabel htmlFor="vacation">Vacation Dates</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="vacation"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !vacationDates && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
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
            <FieldLabel htmlFor="disabled-date" className="opacity-50">
              Event Date (Disabled)
            </FieldLabel>
            <Button
              id="disabled-date"
              variant="outline"
              className="w-full justify-start text-left font-normal opacity-50"
              disabled
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
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
                <FieldLabel htmlFor="basic-name">Name</FieldLabel>
                <Input id="basic-name" placeholder="Enter your name" />
              </Field>
              <Field>
                <FieldLabel htmlFor="basic-email">Email</FieldLabel>
                <Input
                  id="basic-email"
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
                <FieldLabel htmlFor="address-street">Street Address</FieldLabel>
                <Input id="address-street" placeholder="123 Main St" />
              </Field>
              <FieldGroup className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="address-city">City</FieldLabel>
                  <Input id="address-city" placeholder="New York" />
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
              <Field>
                <FieldLabel>Preferred Contact Method</FieldLabel>
                <RadioGroup defaultValue="email">
                  <Field>
                    <RadioGroupItem value="email" id="contact-email" />
                    <FieldContent>
                      <FieldLabel
                        htmlFor="contact-email"
                        className="font-normal"
                      >
                        Email
                      </FieldLabel>
                    </FieldContent>
                  </Field>
                  <Field>
                    <RadioGroupItem value="phone" id="contact-phone" />
                    <FieldContent>
                      <FieldLabel
                        htmlFor="contact-phone"
                        className="font-normal"
                      >
                        Phone
                      </FieldLabel>
                    </FieldContent>
                  </Field>
                  <Field>
                    <RadioGroupItem value="sms" id="contact-sms" />
                    <FieldContent>
                      <FieldLabel htmlFor="contact-sms" className="font-normal">
                        SMS
                      </FieldLabel>
                    </FieldContent>
                  </Field>
                </RadioGroup>
              </Field>
              <Field>
                <FieldLabel>Notification Types</FieldLabel>
                <Field>
                  <Checkbox id="updates" defaultChecked />
                  <FieldContent>
                    <FieldLabel htmlFor="updates" className="font-normal">
                      Product updates
                    </FieldLabel>
                  </FieldContent>
                </Field>
                <Field>
                  <Checkbox id="newsletters" />
                  <FieldContent>
                    <FieldLabel htmlFor="newsletters" className="font-normal">
                      Newsletters
                    </FieldLabel>
                  </FieldContent>
                </Field>
                <Field>
                  <Checkbox id="promotions" />
                  <FieldContent>
                    <FieldLabel htmlFor="promotions" className="font-normal">
                      Promotional offers
                    </FieldLabel>
                  </FieldContent>
                </Field>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Account Settings</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="two-factor">
                    Two-Factor Authentication
                  </FieldLabel>
                  <FieldDescription>
                    Add an extra layer of security to your account.
                  </FieldDescription>
                </FieldContent>
                <Switch id="two-factor" />
              </Field>
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="public-profile">
                    Public Profile
                  </FieldLabel>
                  <FieldDescription>
                    Make your profile visible to other users.
                  </FieldDescription>
                </FieldContent>
                <Switch id="public-profile" defaultChecked />
              </Field>
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="activity-status">
                    Show Activity Status
                  </FieldLabel>
                  <FieldDescription>
                    Let others see when you&apos;re online.
                  </FieldDescription>
                </FieldContent>
                <Switch id="activity-status" />
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
                <FieldLabel htmlFor="emergency-name">Contact Name</FieldLabel>
                <Input id="emergency-name" placeholder="Jane Doe" />
                <FieldDescription>
                  Full name of your emergency contact.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="emergency-relationship">
                  Relationship
                </FieldLabel>
                <Select>
                  <SelectTrigger id="emergency-relationship">
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
                <FieldLabel htmlFor="emergency-phone">Phone Number</FieldLabel>
                <Input
                  id="emergency-phone"
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
                <FieldLabel htmlFor="comments">Comments</FieldLabel>
                <Textarea
                  id="comments"
                  placeholder="Any additional information..."
                  className="min-h-[100px]"
                />
              </Field>
              <Field>
                <Checkbox id="agree-terms" />
                <FieldContent>
                  <FieldLabel htmlFor="agree-terms" className="font-normal">
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
            <FieldLabel htmlFor="section1-input">Section 1</FieldLabel>
            <Input id="section1-input" placeholder="First section input" />
            <FieldDescription>
              This is the first section of the form.
            </FieldDescription>
          </Field>
          <FieldSeparator />
          <Field>
            <FieldLabel htmlFor="section2-input">Section 2</FieldLabel>
            <Input id="section2-input" placeholder="Second section input" />
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
            <Field>
              <Checkbox id="option1" />
              <FieldContent>
                <FieldLabel htmlFor="option1" className="font-normal">
                  Enable additional features
                </FieldLabel>
              </FieldContent>
            </Field>
            <Field>
              <Checkbox id="option2" />
              <FieldContent>
                <FieldLabel htmlFor="option2" className="font-normal">
                  Subscribe to updates
                </FieldLabel>
              </FieldContent>
            </Field>
          </FieldGroup>
          <FieldSeparator />
          <Field>
            <FieldLabel htmlFor="final-section">Final Section</FieldLabel>
            <Textarea
              id="final-section"
              placeholder="Any additional comments..."
              className="min-h-[80px]"
            />
          </Field>
          <FieldSeparator>Or choose a different path</FieldSeparator>
          <FieldGroup>
            <Field>
              <RadioGroup defaultValue="option1">
                <Field>
                  <RadioGroupItem value="option1" id="path1" />
                  <FieldContent>
                    <FieldLabel htmlFor="path1" className="font-normal">
                      Option Path 1
                    </FieldLabel>
                  </FieldContent>
                </Field>
                <Field>
                  <RadioGroupItem value="option2" id="path2" />
                  <FieldContent>
                    <FieldLabel htmlFor="path2" className="font-normal">
                      Option Path 2
                    </FieldLabel>
                  </FieldContent>
                </Field>
              </RadioGroup>
            </Field>
          </FieldGroup>
          <FieldSeparator>Account Settings</FieldSeparator>
          <FieldGroup>
            <Field>
              <Switch id="separator-7e9-notifications" />
              <FieldContent>
                <FieldLabel htmlFor="separator-7e9-notifications">
                  Enable Notifications
                </FieldLabel>
                <FieldDescription>
                  Receive updates about your account activity.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field>
              <Switch id="separator-7e9-privacy" />
              <FieldContent>
                <FieldLabel htmlFor="separator-7e9-privacy">
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
        <FieldGroup variant="outline">
          <Field>
            <FieldContent>
              <FieldLabel htmlFor="outline-demo-8h3-email-notif">
                Email Notifications
              </FieldLabel>
              <FieldDescription>
                Receive updates via email about your account activity
              </FieldDescription>
            </FieldContent>
            <Switch id="outline-demo-8h3-email-notif" defaultChecked />
          </Field>
          <FieldSeparator />
          <Field>
            <FieldContent>
              <FieldLabel htmlFor="outline-demo-8h3-push-notif">
                Push Notifications
              </FieldLabel>
              <FieldDescription>
                Get instant notifications on your device
              </FieldDescription>
            </FieldContent>
            <Switch id="outline-demo-8h3-push-notif" defaultChecked />
          </Field>
          <FieldSeparator />
          <Field>
            <Switch id="outline-demo-8h3-sms-notif" />
            <FieldContent>
              <FieldLabel htmlFor="outline-demo-8h3-sms-notif">
                SMS Notifications
              </FieldLabel>
              <FieldDescription>
                Receive text messages for important updates
              </FieldDescription>
            </FieldContent>
          </Field>
          <FieldSeparator />
          <Field>
            <Switch id="outline-demo-8h3-weekly-digest" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="outline-demo-8h3-weekly-digest">
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
        <FieldGroup variant="outline">
          <Field>
            <FieldLabel htmlFor="contact-3k2-firstName">First Name</FieldLabel>
            <Input id="contact-3k2-firstName" placeholder="John" required />
          </Field>
          <Field>
            <FieldLabel>Show these items on the desktop:</FieldLabel>
            <Field>
              <Checkbox id="finder-pref-9k2-hard-disks" />
              <FieldContent>
                <FieldLabel
                  htmlFor="finder-pref-9k2-hard-disks"
                  className="font-normal"
                >
                  Hard disks
                </FieldLabel>
              </FieldContent>
            </Field>
            <Field>
              <Checkbox id="finder-pref-9k2-external-disks" />
              <FieldContent>
                <FieldLabel
                  htmlFor="finder-pref-9k2-external-disks"
                  className="font-normal"
                >
                  External disks
                </FieldLabel>
              </FieldContent>
            </Field>
            <Field>
              <Checkbox id="finder-pref-9k2-cds-dvds" />
              <FieldContent>
                <FieldLabel
                  htmlFor="finder-pref-9k2-cds-dvds"
                  className="font-normal"
                >
                  CDs, DVDs, and iPods
                </FieldLabel>
              </FieldContent>
            </Field>
            <Field>
              <Checkbox id="finder-pref-9k2-connected-servers" />
              <FieldContent>
                <FieldLabel
                  htmlFor="finder-pref-9k2-connected-servers"
                  className="font-normal"
                >
                  Connected servers
                </FieldLabel>
              </FieldContent>
            </Field>
          </Field>
          <FieldSeparator />
          <Field>
            <FieldContent>
              <FieldLabel htmlFor="outline-demo-8h3-profile-public">
                Public Profile
              </FieldLabel>
              <FieldDescription>
                Make your profile visible to everyone
              </FieldDescription>
            </FieldContent>
            <Switch id="outline-demo-8h3-profile-public" />
          </Field>
          <FieldSeparator />
          <Field>
            <FieldContent>
              <FieldLabel htmlFor="outline-demo-8h3-share-data">
                Share Usage Data
              </FieldLabel>
              <FieldDescription>
                Help improve our services by sharing anonymous usage data. This
                data helps us understand how our product is used and how we can
                improve it.
              </FieldDescription>
            </FieldContent>
            <Switch id="outline-demo-8h3-share-data" />
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
                <FieldLabel htmlFor="profileFirstName">First Name</FieldLabel>
                <Input id="profileFirstName" defaultValue="John" />
              </Field>
              <Field>
                <FieldLabel htmlFor="profileLastName">Last Name</FieldLabel>
                <Input id="profileLastName" defaultValue="Doe" />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="profileEmail">Email</FieldLabel>
              <Input
                id="profileEmail"
                type="email"
                defaultValue="john@example.com"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
            </Field>
            <Field>
              <FieldLabel htmlFor="bio">Bio</FieldLabel>
              <Textarea
                id="bio"
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
                <Field>
                  <FieldContent>
                    <FieldLabel htmlFor="emailNotifications">
                      Email notifications
                    </FieldLabel>
                    <FieldDescription>
                      Receive emails about new products, features, and more. If
                      you don&apos;t want to receive these emails, you can turn
                      them off.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="emailNotifications"
                    defaultChecked
                    className="ml-auto"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="pushNotifications">
                    Push notifications
                  </FieldLabel>
                  <Switch id="pushNotifications" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="marketingEmails">
                    Marketing emails
                  </FieldLabel>
                  <Switch
                    id="marketingEmails"
                    defaultChecked
                    className="ml-auto"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
            <Field>
              <Button type="submit">Save Changes</Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
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
              <FieldLabel htmlFor="surveyName">Name (Optional)</FieldLabel>
              <Input id="surveyName" placeholder="Your name" />
            </Field>
            <Field>
              <FieldLabel htmlFor="ageGroup">Age Group</FieldLabel>
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
                <Field>
                  <RadioGroupItem value="daily" id="daily" />
                  <FieldLabel htmlFor="daily">Daily</FieldLabel>
                </Field>
                <Field>
                  <RadioGroupItem value="weekly" id="weekly" />
                  <FieldLabel htmlFor="weekly">Weekly</FieldLabel>
                </Field>
                <Field>
                  <RadioGroupItem value="monthly" id="monthly" />
                  <FieldContent>
                    <FieldLabel htmlFor="monthly">Monthly</FieldLabel>
                  </FieldContent>
                </Field>
                <Field>
                  <RadioGroupItem value="rarely" id="rarely" />
                  <FieldLabel htmlFor="rarely">Rarely</FieldLabel>
                </Field>
              </RadioGroup>
            </Field>
            <Field>
              <FieldLabel>
                Which features do you use most? (Select all that apply)
              </FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                <Field>
                  <Checkbox id="dashboard" />
                  <FieldContent>
                    <FieldLabel htmlFor="dashboard" className="text-sm">
                      Dashboard
                    </FieldLabel>
                  </FieldContent>
                </Field>
                <Field>
                  <Checkbox id="reports" />
                  <FieldContent>
                    <FieldLabel htmlFor="reports" className="text-sm">
                      Reports
                    </FieldLabel>
                  </FieldContent>
                </Field>
                <Field>
                  <Checkbox id="analytics" />
                  <FieldContent>
                    <FieldLabel htmlFor="analytics" className="text-sm">
                      Analytics
                    </FieldLabel>
                  </FieldContent>
                </Field>
                <Field>
                  <Checkbox id="integrations" />
                  <FieldContent>
                    <FieldLabel htmlFor="integrations" className="text-sm">
                      Integrations
                    </FieldLabel>
                  </FieldContent>
                </Field>
                <Field>
                  <Checkbox id="api" />
                  <FieldContent>
                    <FieldLabel htmlFor="api" className="text-sm">
                      API Access
                    </FieldLabel>
                  </FieldContent>
                </Field>
                <Field>
                  <Checkbox id="support" />
                  <FieldContent>
                    <FieldLabel htmlFor="support" className="text-sm">
                      Support
                    </FieldLabel>
                  </FieldContent>
                </Field>
              </div>
            </Field>
            <Field>
              <FieldLabel>How satisfied are you with our product?</FieldLabel>
              <RadioGroup>
                <Field>
                  <RadioGroupItem value="very-satisfied" id="very-satisfied" />
                  <FieldLabel htmlFor="very-satisfied">
                    Very Satisfied
                  </FieldLabel>
                </Field>
                <Field>
                  <RadioGroupItem value="satisfied" id="satisfied" />
                  <FieldLabel htmlFor="satisfied">Satisfied</FieldLabel>
                </Field>
                <Field>
                  <RadioGroupItem value="neutral" id="neutral" />
                  <FieldLabel htmlFor="neutral">Neutral</FieldLabel>
                </Field>
                <Field>
                  <RadioGroupItem value="dissatisfied" id="dissatisfied" />
                  <FieldLabel htmlFor="dissatisfied">Dissatisfied</FieldLabel>
                </Field>
                <Field>
                  <RadioGroupItem
                    value="very-dissatisfied"
                    id="very-dissatisfied"
                  />
                  <FieldLabel htmlFor="very-dissatisfied">
                    Very Dissatisfied
                  </FieldLabel>
                </Field>
              </RadioGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="improvements">
                What improvements would you like to see?
              </FieldLabel>
              <Textarea
                id="improvements"
                placeholder="Share your suggestions for improvements..."
                className="min-h-[80px]"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="recommend">
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
                    <FieldLabel htmlFor="complex-6d8-firstName">
                      First Name
                    </FieldLabel>
                    <Input
                      id="complex-6d8-firstName"
                      placeholder="John"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="complex-6d8-lastName">
                      Last Name
                    </FieldLabel>
                    <Input
                      id="complex-6d8-lastName"
                      placeholder="Doe"
                      required
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="complex-6d8-email">
                    Email Address
                  </FieldLabel>
                  <Input
                    id="complex-6d8-email"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                  />
                  <FieldDescription>
                    We&apos;ll use this for all communications.
                  </FieldDescription>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="complex-6d8-phone">
                      Phone Number
                    </FieldLabel>
                    <Input
                      id="complex-6d8-phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                    />
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Professional Background</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="position">
                    Position Applying For
                  </FieldLabel>
                  <Select>
                    <SelectTrigger id="position">
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
                  <FieldLabel htmlFor="experience">
                    Years of Experience
                  </FieldLabel>
                  <Slider id="experience" max={20} min={0} step={1} />
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
                  <FieldLabel htmlFor="portfolio">Portfolio URL</FieldLabel>
                  <Input
                    id="portfolio"
                    type="url"
                    placeholder="https://yourportfolio.com"
                  />
                  <FieldDescription>
                    Optional: Share your portfolio or GitHub profile
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="coverLetter">Cover Letter</FieldLabel>
                  <Textarea
                    id="coverLetter"
                    placeholder="Tell us why you're a great fit for this position..."
                    className="min-h-[120px]"
                  />
                  <FieldDescription>
                    Briefly describe your interest and qualifications (500 words
                    max)
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="resume">Upload Resume</FieldLabel>
                  <Input id="resume" type="file" accept=".pdf,.doc,.docx" />
                  <FieldDescription>
                    PDF or Word document (max 5MB)
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="references">
                    References Available
                  </FieldLabel>
                  <RadioGroup defaultValue="yes">
                    <Field>
                      <RadioGroupItem value="yes" id="ref-yes" />
                      <FieldLabel htmlFor="ref-yes" className="font-normal">
                        Yes, upon request
                      </FieldLabel>
                    </Field>
                    <Field>
                      <RadioGroupItem value="no" id="ref-no" />
                      <FieldLabel htmlFor="ref-no" className="font-normal">
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
                  <FieldLabel htmlFor="verification">
                    Enter Verification Code
                  </FieldLabel>
                  <FieldDescription>
                    Enter the 6-digit code sent to your email
                  </FieldDescription>
                  <InputOTP id="verification" maxLength={6}>
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

                <Field>
                  <Field>
                    <FieldLabel htmlFor="notifications">
                      Email Notifications
                    </FieldLabel>
                    <FieldDescription>
                      Receive updates about your application status
                    </FieldDescription>
                  </Field>
                  <Switch id="notifications" defaultChecked />
                </Field>
                <FieldGroup>
                  <Field>
                    <Checkbox id="terms" required />
                    <FieldLabel htmlFor="terms" className="font-normal">
                      I agree to the terms and conditions and privacy policy
                    </FieldLabel>
                  </Field>
                  <Field>
                    <Checkbox id="accurate" required />
                    <FieldLabel htmlFor="accurate" className="font-normal">
                      I confirm that all information provided is accurate
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </FieldSet>

            <Field>
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
  const [skills, setSkills] = useState<string[]>([])
  const [workType, setWorkType] = useState("hybrid")

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Job Application Form (Validation State)</CardTitle>
        <CardDescription>
          Example showing all fields with invalid state
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
                  <Field data-invalid>
                    <FieldLabel htmlFor="firstName-invalid">
                      First Name
                    </FieldLabel>
                    <Input
                      id="firstName-invalid"
                      placeholder="John"
                      required
                      aria-invalid
                    />
                  </Field>
                  <Field data-invalid>
                    <FieldLabel htmlFor="lastName-invalid">
                      Last Name
                    </FieldLabel>
                    <Input
                      id="lastName-invalid"
                      placeholder="Doe"
                      required
                      aria-invalid
                    />
                  </Field>
                </div>

                <Field data-invalid>
                  <FieldLabel htmlFor="email-invalid">Email Address</FieldLabel>
                  <Input
                    id="email-invalid"
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
                    <FieldLabel htmlFor="phone-invalid">
                      Phone Number
                    </FieldLabel>
                    <Input
                      id="phone-invalid"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      aria-invalid
                    />
                  </Field>
                  <Field data-invalid>
                    <FieldLabel htmlFor="birthdate-invalid">
                      Date of Birth
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="birthdate-invalid"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
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
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>Professional Background</FieldLegend>
              <FieldGroup>
                <Field data-invalid>
                  <FieldLabel htmlFor="position-invalid">
                    Position Applying For
                  </FieldLabel>
                  <Select>
                    <SelectTrigger id="position-invalid" aria-invalid>
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
                  <FieldLabel htmlFor="experience-invalid">
                    Years of Experience
                  </FieldLabel>
                  <Slider
                    id="experience-invalid"
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

                <Field data-invalid>
                  <FieldLabel>Salary Expectations</FieldLabel>
                  <RadioGroup defaultValue="80-100">
                    <Field data-invalid>
                      <RadioGroupItem value="60-80" id="salary-60-80-invalid" />
                      <FieldLabel
                        htmlFor="salary-60-80-invalid"
                        className="font-normal"
                      >
                        $60,000 - $80,000
                      </FieldLabel>
                    </Field>
                    <Field data-invalid>
                      <RadioGroupItem
                        value="80-100"
                        id="salary-80-100-invalid"
                      />
                      <FieldLabel
                        htmlFor="salary-80-100-invalid"
                        className="font-normal"
                      >
                        $80,000 - $100,000
                      </FieldLabel>
                    </Field>
                    <Field data-invalid>
                      <RadioGroupItem
                        value="100-120"
                        id="salary-100-120-invalid"
                      />
                      <FieldLabel
                        htmlFor="salary-100-120-invalid"
                        className="font-normal"
                      >
                        $100,000 - $120,000
                      </FieldLabel>
                    </Field>
                    <Field data-invalid>
                      <RadioGroupItem
                        value="120+"
                        id="salary-120-plus-invalid"
                      />
                      <FieldLabel
                        htmlFor="salary-120-plus-invalid"
                        className="font-normal"
                      >
                        $120,000+
                      </FieldLabel>
                    </Field>
                  </RadioGroup>
                </Field>

                <Field data-invalid>
                  <FieldLabel>Technical Skills</FieldLabel>
                  <FieldDescription>Select all that apply</FieldDescription>
                  <div className="grid grid-cols-3 gap-3">
                    <Field data-invalid>
                      <Checkbox
                        id="skill-js-invalid"
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSkills([...skills, "javascript"])
                          } else {
                            setSkills(skills.filter((s) => s !== "javascript"))
                          }
                        }}
                      />
                      <FieldLabel
                        htmlFor="skill-js-invalid"
                        className="font-normal"
                      >
                        JavaScript
                      </FieldLabel>
                    </Field>
                    <Field data-invalid>
                      <Checkbox id="skill-ts-invalid" />
                      <FieldLabel
                        htmlFor="skill-ts-invalid"
                        className="font-normal"
                      >
                        TypeScript
                      </FieldLabel>
                    </Field>
                    <Field data-invalid>
                      <Checkbox id="skill-react-invalid" />
                      <FieldLabel
                        htmlFor="skill-react-invalid"
                        className="font-normal"
                      >
                        React
                      </FieldLabel>
                    </Field>
                    <Field data-invalid>
                      <Checkbox id="skill-node-invalid" />
                      <FieldLabel
                        htmlFor="skill-node-invalid"
                        className="font-normal"
                      >
                        Node.js
                      </FieldLabel>
                    </Field>
                    <Field data-invalid>
                      <Checkbox id="skill-python-invalid" />
                      <FieldLabel
                        htmlFor="skill-python-invalid"
                        className="font-normal"
                      >
                        Python
                      </FieldLabel>
                    </Field>
                    <Field data-invalid>
                      <Checkbox id="skill-docker-invalid" />
                      <FieldLabel
                        htmlFor="skill-docker-invalid"
                        className="font-normal"
                      >
                        Docker
                      </FieldLabel>
                    </Field>
                  </div>
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Additional Information</FieldLegend>
              <FieldGroup>
                <Field data-invalid>
                  <FieldLabel htmlFor="portfolio-invalid">
                    Portfolio URL
                  </FieldLabel>
                  <Input
                    id="portfolio-invalid"
                    type="url"
                    placeholder="https://yourportfolio.com"
                    aria-invalid
                  />
                  <FieldDescription>
                    Optional: Share your portfolio or GitHub profile
                  </FieldDescription>
                </Field>
                <Field data-invalid>
                  <FieldLabel htmlFor="coverLetter-invalid">
                    Cover Letter
                  </FieldLabel>
                  <Textarea
                    id="coverLetter-invalid"
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
                  <FieldLabel htmlFor="resume-invalid">
                    Upload Resume
                  </FieldLabel>
                  <Input
                    id="resume-invalid"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    aria-invalid
                  />
                  <FieldDescription>
                    PDF or Word document (max 5MB)
                  </FieldDescription>
                </Field>
                <Field data-invalid>
                  <FieldLabel htmlFor="references-invalid">
                    References Available
                  </FieldLabel>
                  <RadioGroup defaultValue="yes" aria-invalid>
                    <Field data-invalid>
                      <RadioGroupItem value="yes" id="ref-yes-invalid" />
                      <FieldLabel
                        htmlFor="ref-yes-invalid"
                        className="font-normal"
                      >
                        Yes, upon request
                      </FieldLabel>
                    </Field>
                    <Field data-invalid>
                      <RadioGroupItem value="no" id="ref-no-invalid" />
                      <FieldLabel
                        htmlFor="ref-no-invalid"
                        className="font-normal"
                      >
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
                <Field data-invalid>
                  <FieldLabel htmlFor="verification-invalid">
                    Enter Verification Code
                  </FieldLabel>
                  <FieldDescription>
                    Enter the 6-digit code sent to your email
                  </FieldDescription>
                  <InputOTP id="verification-invalid" maxLength={6}>
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
                <Field data-invalid>
                  <FieldContent>
                    <FieldLabel htmlFor="notifications-invalid">
                      Email Notifications
                    </FieldLabel>
                    <FieldDescription>
                      Receive updates about your application status
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="notifications-invalid"
                    defaultChecked
                    className="ml-auto"
                    aria-invalid
                  />
                </Field>
                <FieldGroup>
                  <Field data-invalid>
                    <Checkbox id="terms-invalid" required />
                    <FieldLabel htmlFor="terms-invalid" className="font-normal">
                      I agree to the terms and conditions and privacy policy
                    </FieldLabel>
                  </Field>
                  <Field data-invalid>
                    <Checkbox id="accurate-invalid" required />
                    <FieldLabel
                      htmlFor="accurate-invalid"
                      className="font-normal"
                    >
                      I confirm that all information provided is accurate
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </FieldSet>
            <Field>
              <Button variant="outline">Save Draft</Button>
              <Button type="submit">Submit Application</Button>
            </Field>
          </FieldGroup>
        </form>
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
                    <FieldLabel htmlFor="checkout-7j9-first-name">
                      First Name
                    </FieldLabel>
                    <Input
                      id="checkout-7j9-first-name"
                      placeholder="John"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-last-name">
                      Last Name
                    </FieldLabel>
                    <Input
                      id="checkout-7j9-last-name"
                      placeholder="Doe"
                      required
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-email">Email</FieldLabel>
                  <Input
                    id="checkout-7j9-email"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                  />
                  <FieldDescription>
                    We&apos;ll send your receipt to this email
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-address">
                    Street Address
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-address"
                    placeholder="123 Main Street"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-address2">
                    Apartment, suite, etc. (optional)
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-address2"
                    placeholder="Apartment 4B"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Field className="sm:col-span-2">
                    <FieldLabel htmlFor="checkout-7j9-city">City</FieldLabel>
                    <Input
                      id="checkout-7j9-city"
                      placeholder="New York"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-state">State</FieldLabel>
                    <Select defaultValue="">
                      <SelectTrigger id="checkout-7j9-state">
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
                    <FieldLabel htmlFor="checkout-7j9-country-code">
                      Code
                    </FieldLabel>
                    <Select defaultValue="us">
                      <SelectTrigger id="checkout-7j9-country-code">
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
                    <FieldLabel htmlFor="checkout-7j9-phone">
                      Phone Number
                    </FieldLabel>
                    <Input
                      id="checkout-7j9-phone"
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
                  <FieldLabel htmlFor="checkout-7j9-card-name">
                    Name on Card
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-card-name"
                    placeholder="John Doe"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-number">
                    Card Number
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-card-number"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                  <FieldDescription>
                    Enter your 16-digit card number
                  </FieldDescription>
                </Field>
                <div className="grid grid-cols-3 gap-4">
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-exp-month">
                      Month
                    </FieldLabel>
                    <Select defaultValue="">
                      <SelectTrigger id="checkout-7j9-exp-month">
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
                    <FieldLabel htmlFor="checkout-7j9-exp-year">
                      Year
                    </FieldLabel>
                    <Select defaultValue="">
                      <SelectTrigger id="checkout-7j9-exp-year">
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
                <Field>
                  <Checkbox id="checkout-7j9-same-as-shipping" defaultChecked />
                  <FieldLabel
                    htmlFor="checkout-7j9-same-as-shipping"
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
              <FieldGroup>
                <FieldGroup>
                  <Field>
                    <Checkbox id="checkout-7j9-save-info" />
                    <FieldLabel
                      htmlFor="checkout-7j9-save-info"
                      className="font-normal"
                    >
                      Save my information for faster checkout next time
                    </FieldLabel>
                  </Field>
                  <Field>
                    <Checkbox id="checkout-7j9-newsletter" />
                    <FieldLabel
                      htmlFor="checkout-7j9-newsletter"
                      className="font-normal"
                    >
                      Email me with news and offers
                    </FieldLabel>
                  </Field>
                </FieldGroup>
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
