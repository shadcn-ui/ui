"use client"

import { useState } from "react"
import { REGEXP_ONLY_DIGITS } from "input-otp"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/radix/components/example"
import { Badge } from "@/registry/bases/radix/ui/badge"
import { Checkbox } from "@/registry/bases/radix/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/registry/bases/radix/ui/field"
import { Input } from "@/registry/bases/radix/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/registry/bases/radix/ui/input-otp"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/registry/bases/radix/ui/native-select"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/bases/radix/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/radix/ui/select"
import { Slider } from "@/registry/bases/radix/ui/slider"
import { Switch } from "@/registry/bases/radix/ui/switch"
import { Textarea } from "@/registry/bases/radix/ui/textarea"

export default function FieldExample() {
  return (
    <ExampleWrapper>
      <InputFields />
      <TextareaFields />
      <SelectFields />
      <CheckboxFields />
      <RadioFields />
      <SwitchFields />
      <SliderFields />
      <NativeSelectFields />
      <InputOTPFields />
    </ExampleWrapper>
  )
}

function InputFields() {
  return (
    <Example title="Input Fields">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="input-basic">Basic Input</FieldLabel>
          <Input id="input-basic" placeholder="Enter text" />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-with-desc">
            Input with Description
          </FieldLabel>
          <Input id="input-with-desc" placeholder="Enter your username" />
          <FieldDescription>
            Choose a unique username for your account.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="input-desc-first">Email Address</FieldLabel>
          <FieldDescription>
            We&apos;ll never share your email with anyone.
          </FieldDescription>
          <Input
            id="input-desc-first"
            type="email"
            placeholder="email@example.com"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-required">
            Required Field <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="input-required"
            placeholder="This field is required"
            required
          />
          <FieldDescription>This field must be filled out.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="input-disabled">Disabled Input</FieldLabel>
          <Input id="input-disabled" placeholder="Cannot edit" disabled />
          <FieldDescription>This field is currently disabled.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="input-badge">
            Input with Badge{" "}
            <Badge variant="secondary" className="ml-auto">
              Recommended
            </Badge>
          </FieldLabel>
          <Input id="input-badge" placeholder="Enter value" />
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="input-invalid">Invalid Input</FieldLabel>
          <Input
            id="input-invalid"
            placeholder="This field has an error"
            aria-invalid
          />
          <FieldDescription>
            This field contains validation errors.
          </FieldDescription>
        </Field>
        <Field data-disabled>
          <FieldLabel htmlFor="input-disabled-field">Disabled Field</FieldLabel>
          <Input id="input-disabled-field" placeholder="Cannot edit" disabled />
          <FieldDescription>This field is currently disabled.</FieldDescription>
        </Field>
      </FieldGroup>
    </Example>
  )
}

function TextareaFields() {
  return (
    <Example title="Textarea Fields">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="textarea-basic">Basic Textarea</FieldLabel>
          <Textarea id="textarea-basic" placeholder="Enter your message" />
        </Field>
        <Field>
          <FieldLabel htmlFor="textarea-comments">Comments</FieldLabel>
          <Textarea
            id="textarea-comments"
            placeholder="Share your thoughts..."
            className="min-h-[100px]"
          />
          <FieldDescription>Maximum 500 characters allowed.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="textarea-bio">Bio</FieldLabel>
          <FieldDescription>
            Tell us about yourself in a few sentences.
          </FieldDescription>
          <Textarea
            id="textarea-bio"
            placeholder="I am a..."
            className="min-h-[120px]"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="textarea-desc-after">Message</FieldLabel>
          <Textarea id="textarea-desc-after" placeholder="Enter your message" />
          <FieldDescription>
            Enter your message so it is long enough to test the layout.
          </FieldDescription>
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="textarea-invalid">Invalid Textarea</FieldLabel>
          <Textarea
            id="textarea-invalid"
            placeholder="This field has an error"
            aria-invalid
          />
          <FieldDescription>
            This field contains validation errors.
          </FieldDescription>
        </Field>
        <Field data-disabled>
          <FieldLabel htmlFor="textarea-disabled-field">
            Disabled Field
          </FieldLabel>
          <Textarea
            id="textarea-disabled-field"
            placeholder="Cannot edit"
            disabled
          />
          <FieldDescription>This field is currently disabled.</FieldDescription>
        </Field>
      </FieldGroup>
    </Example>
  )
}

function SelectFields() {
  return (
    <Example title="Select Fields">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="select-basic">Basic Select</FieldLabel>
          <Select>
            <SelectTrigger id="select-basic">
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
          <FieldLabel htmlFor="select-country">Country</FieldLabel>
          <Select>
            <SelectTrigger id="select-country">
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
          <FieldLabel htmlFor="select-timezone">Timezone</FieldLabel>
          <FieldDescription>
            Choose your local timezone for accurate scheduling.
          </FieldDescription>
          <Select>
            <SelectTrigger id="select-timezone">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utc">UTC</SelectItem>
              <SelectItem value="est">Eastern Time</SelectItem>
              <SelectItem value="pst">Pacific Time</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="select-invalid">Invalid Select</FieldLabel>
          <Select>
            <SelectTrigger id="select-invalid" aria-invalid>
              <SelectValue placeholder="This field has an error" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>
            This field contains validation errors.
          </FieldDescription>
        </Field>
        <Field data-disabled>
          <FieldLabel htmlFor="select-disabled-field">
            Disabled Field
          </FieldLabel>
          <Select disabled>
            <SelectTrigger id="select-disabled-field">
              <SelectValue placeholder="Cannot select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>This field is currently disabled.</FieldDescription>
        </Field>
      </FieldGroup>
    </Example>
  )
}

function NativeSelectFields() {
  return (
    <Example title="Native Select Fields">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="native-select-basic">
            Basic Native Select
          </FieldLabel>
          <NativeSelect id="native-select-basic">
            <NativeSelectOption value="">Choose an option</NativeSelectOption>
            <NativeSelectOption value="option1">Option 1</NativeSelectOption>
            <NativeSelectOption value="option2">Option 2</NativeSelectOption>
            <NativeSelectOption value="option3">Option 3</NativeSelectOption>
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel htmlFor="native-select-country">Country</FieldLabel>
          <NativeSelect id="native-select-country">
            <NativeSelectOption value="">
              Select your country
            </NativeSelectOption>
            <NativeSelectOption value="us">United States</NativeSelectOption>
            <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
            <NativeSelectOption value="ca">Canada</NativeSelectOption>
          </NativeSelect>
          <FieldDescription>
            Select the country where you currently reside.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="native-select-timezone">Timezone</FieldLabel>
          <FieldDescription>
            Choose your local timezone for accurate scheduling.
          </FieldDescription>
          <NativeSelect id="native-select-timezone">
            <NativeSelectOption value="">Select timezone</NativeSelectOption>
            <NativeSelectOption value="utc">UTC</NativeSelectOption>
            <NativeSelectOption value="est">Eastern Time</NativeSelectOption>
            <NativeSelectOption value="pst">Pacific Time</NativeSelectOption>
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel htmlFor="native-select-grouped">
            Grouped Options
          </FieldLabel>
          <NativeSelect id="native-select-grouped">
            <NativeSelectOption value="">Select a region</NativeSelectOption>
            <NativeSelectOptGroup label="North America">
              <NativeSelectOption value="us">United States</NativeSelectOption>
              <NativeSelectOption value="ca">Canada</NativeSelectOption>
              <NativeSelectOption value="mx">Mexico</NativeSelectOption>
            </NativeSelectOptGroup>
            <NativeSelectOptGroup label="Europe">
              <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
              <NativeSelectOption value="fr">France</NativeSelectOption>
              <NativeSelectOption value="de">Germany</NativeSelectOption>
            </NativeSelectOptGroup>
          </NativeSelect>
          <FieldDescription>
            Native select with grouped options using optgroup.
          </FieldDescription>
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="native-select-invalid">
            Invalid Native Select
          </FieldLabel>
          <NativeSelect id="native-select-invalid" aria-invalid>
            <NativeSelectOption value="">
              This field has an error
            </NativeSelectOption>
            <NativeSelectOption value="option1">Option 1</NativeSelectOption>
            <NativeSelectOption value="option2">Option 2</NativeSelectOption>
            <NativeSelectOption value="option3">Option 3</NativeSelectOption>
          </NativeSelect>
          <FieldDescription>
            This field contains validation errors.
          </FieldDescription>
        </Field>
        <Field data-disabled>
          <FieldLabel htmlFor="native-select-disabled-field">
            Disabled Field
          </FieldLabel>
          <NativeSelect id="native-select-disabled-field" disabled>
            <NativeSelectOption value="">Cannot select</NativeSelectOption>
            <NativeSelectOption value="option1">Option 1</NativeSelectOption>
            <NativeSelectOption value="option2">Option 2</NativeSelectOption>
            <NativeSelectOption value="option3">Option 3</NativeSelectOption>
          </NativeSelect>
          <FieldDescription>This field is currently disabled.</FieldDescription>
        </Field>
      </FieldGroup>
    </Example>
  )
}

function CheckboxFields() {
  return (
    <Example title="Checkbox Fields">
      <FieldGroup>
        <Field orientation="horizontal">
          <Checkbox id="checkbox-basic" defaultChecked />
          <FieldLabel htmlFor="checkbox-basic" className="font-normal">
            I agree to the terms and conditions
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="checkbox-right">
            Accept terms and conditions
          </FieldLabel>
          <Checkbox id="checkbox-right" />
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="checkbox-with-desc" />
          <FieldContent>
            <FieldLabel htmlFor="checkbox-with-desc">
              Subscribe to newsletter
            </FieldLabel>
            <FieldDescription>
              Receive weekly updates about new features and promotions.
            </FieldDescription>
          </FieldContent>
        </Field>
        <FieldLabel htmlFor="checkbox-with-title">
          <Field orientation="horizontal">
            <Checkbox id="checkbox-with-title" />
            <FieldContent>
              <FieldTitle>Enable Touch ID</FieldTitle>
              <FieldDescription>
                Enable Touch ID to quickly unlock your device.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
        <FieldSet>
          <FieldLegend variant="label">Preferences</FieldLegend>
          <FieldDescription>
            Select all that apply to customize your experience.
          </FieldDescription>
          <FieldGroup className="gap-3">
            <Field orientation="horizontal">
              <Checkbox id="pref-dark" />
              <FieldLabel htmlFor="pref-dark" className="font-normal">
                Dark mode
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="pref-compact" />
              <FieldLabel htmlFor="pref-compact" className="font-normal">
                Compact view
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="pref-notifications" />
              <FieldLabel htmlFor="pref-notifications" className="font-normal">
                Enable notifications
              </FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
        <Field data-invalid orientation="horizontal">
          <Checkbox id="checkbox-invalid" aria-invalid />
          <FieldLabel htmlFor="checkbox-invalid" className="font-normal">
            Invalid checkbox
          </FieldLabel>
        </Field>
        <Field data-disabled orientation="horizontal">
          <Checkbox id="checkbox-disabled-field" disabled />
          <FieldLabel htmlFor="checkbox-disabled-field" className="font-normal">
            Disabled checkbox
          </FieldLabel>
        </Field>
      </FieldGroup>
    </Example>
  )
}

function RadioFields() {
  return (
    <Example title="Radio Fields">
      <FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">Subscription Plan</FieldLegend>
          <RadioGroup defaultValue="free">
            <Field orientation="horizontal">
              <RadioGroupItem value="free" id="radio-free" />
              <FieldLabel htmlFor="radio-free" className="font-normal">
                Free Plan
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="pro" id="radio-pro" />
              <FieldLabel htmlFor="radio-pro" className="font-normal">
                Pro Plan
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="enterprise" id="radio-enterprise" />
              <FieldLabel htmlFor="radio-enterprise" className="font-normal">
                Enterprise
              </FieldLabel>
            </Field>
          </RadioGroup>
        </FieldSet>
        <FieldSet>
          <FieldLegend variant="label">Battery Level</FieldLegend>
          <FieldDescription>
            Choose your preferred battery level.
          </FieldDescription>
          <RadioGroup>
            <Field orientation="horizontal">
              <RadioGroupItem value="high" id="battery-high" />
              <FieldLabel htmlFor="battery-high">High</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="medium" id="battery-medium" />
              <FieldLabel htmlFor="battery-medium">Medium</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="low" id="battery-low" />
              <FieldLabel htmlFor="battery-low">Low</FieldLabel>
            </Field>
          </RadioGroup>
        </FieldSet>
        <RadioGroup className="gap-6">
          <Field orientation="horizontal">
            <RadioGroupItem value="option1" id="radio-content-1" />
            <FieldContent>
              <FieldLabel htmlFor="radio-content-1">Enable Touch ID</FieldLabel>
              <FieldDescription>
                Enable Touch ID to quickly unlock your device.
              </FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="option2" id="radio-content-2" />
            <FieldContent>
              <FieldLabel htmlFor="radio-content-2">
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
          <FieldLabel htmlFor="radio-title-1">
            <Field orientation="horizontal">
              <RadioGroupItem value="title1" id="radio-title-1" />
              <FieldContent>
                <FieldTitle>Enable Touch ID</FieldTitle>
                <FieldDescription>
                  Enable Touch ID to quickly unlock your device.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
          <FieldLabel htmlFor="radio-title-2">
            <Field orientation="horizontal">
              <RadioGroupItem value="title2" id="radio-title-2" />
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
        </RadioGroup>
        <FieldSet>
          <FieldLegend variant="label">Invalid Radio Group</FieldLegend>
          <RadioGroup>
            <Field data-invalid orientation="horizontal">
              <RadioGroupItem
                value="invalid1"
                id="radio-invalid-1"
                aria-invalid
              />
              <FieldLabel htmlFor="radio-invalid-1">
                Invalid Option 1
              </FieldLabel>
            </Field>
            <Field data-invalid orientation="horizontal">
              <RadioGroupItem
                value="invalid2"
                id="radio-invalid-2"
                aria-invalid
              />
              <FieldLabel htmlFor="radio-invalid-2">
                Invalid Option 2
              </FieldLabel>
            </Field>
          </RadioGroup>
        </FieldSet>
        <FieldSet>
          <FieldLegend variant="label">Disabled Radio Group</FieldLegend>
          <RadioGroup disabled>
            <Field data-disabled orientation="horizontal">
              <RadioGroupItem
                value="disabled1"
                id="radio-disabled-1"
                disabled
              />
              <FieldLabel htmlFor="radio-disabled-1">
                Disabled Option 1
              </FieldLabel>
            </Field>
            <Field data-disabled orientation="horizontal">
              <RadioGroupItem
                value="disabled2"
                id="radio-disabled-2"
                disabled
              />
              <FieldLabel htmlFor="radio-disabled-2">
                Disabled Option 2
              </FieldLabel>
            </Field>
          </RadioGroup>
        </FieldSet>
      </FieldGroup>
    </Example>
  )
}

function SwitchFields() {
  return (
    <Example title="Switch Fields">
      <FieldGroup>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="switch-airplane">Airplane Mode</FieldLabel>
            <FieldDescription>
              Turn on airplane mode to disable all connections.
            </FieldDescription>
          </FieldContent>
          <Switch id="switch-airplane" />
        </Field>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="switch-dark">Dark Mode</FieldLabel>
          <Switch id="switch-dark" />
        </Field>
        <Field orientation="horizontal">
          <Switch id="switch-marketing" />
          <FieldContent>
            <FieldLabel htmlFor="switch-marketing">Marketing Emails</FieldLabel>
            <FieldDescription>
              Receive emails about new products, features, and more.
            </FieldDescription>
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>Privacy Settings</FieldLabel>
          <FieldDescription>Manage your privacy preferences.</FieldDescription>
          <Field orientation="horizontal">
            <Switch id="switch-profile" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="switch-profile" className="font-normal">
                Make profile visible to others
              </FieldLabel>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <Switch id="switch-email" />
            <FieldContent>
              <FieldLabel htmlFor="switch-email" className="font-normal">
                Show email on profile
              </FieldLabel>
            </FieldContent>
          </Field>
        </Field>
        <Field data-invalid orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="switch-invalid">Invalid Switch</FieldLabel>
            <FieldDescription>
              This switch has validation errors.
            </FieldDescription>
          </FieldContent>
          <Switch id="switch-invalid" aria-invalid />
        </Field>
        <Field data-disabled orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="switch-disabled-field">
              Disabled Switch
            </FieldLabel>
            <FieldDescription>
              This switch is currently disabled.
            </FieldDescription>
          </FieldContent>
          <Switch id="switch-disabled-field" disabled />
        </Field>
      </FieldGroup>
    </Example>
  )
}

function SliderFields() {
  const [volume, setVolume] = useState([50])
  const [brightness, setBrightness] = useState([75])
  const [temperature, setTemperature] = useState([0.3, 0.7])
  const [priceRange, setPriceRange] = useState([25, 75])
  const [colorBalance, setColorBalance] = useState([10, 20, 70])

  return (
    <Example title="Slider Fields">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="slider-volume">Volume</FieldLabel>
          <Slider
            id="slider-volume"
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="slider-brightness">Screen Brightness</FieldLabel>
          <Slider
            id="slider-brightness"
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
          <FieldLabel htmlFor="slider-quality">Video Quality</FieldLabel>
          <FieldDescription>
            Higher quality uses more bandwidth.
          </FieldDescription>
          <Slider
            id="slider-quality"
            defaultValue={[720]}
            max={1080}
            min={360}
            step={360}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="slider-temperature">
            Temperature Range
          </FieldLabel>
          <Slider
            id="slider-temperature"
            value={temperature}
            onValueChange={setTemperature}
            min={0}
            max={1}
            step={0.1}
          />
          <FieldDescription>
            Range: {temperature[0].toFixed(1)} - {temperature[1].toFixed(1)}
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="slider-price-range">Price Range</FieldLabel>
          <Slider
            id="slider-price-range"
            value={priceRange}
            onValueChange={setPriceRange}
            max={100}
            step={5}
          />
          <FieldDescription>
            ${priceRange[0]} - ${priceRange[1]}
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="slider-color-balance">Color Balance</FieldLabel>
          <Slider
            id="slider-color-balance"
            value={colorBalance}
            onValueChange={setColorBalance}
            max={100}
            step={10}
          />
          <FieldDescription>
            Red: {colorBalance[0]}%, Green: {colorBalance[1]}%, Blue:{" "}
            {colorBalance[2]}%
          </FieldDescription>
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="slider-invalid">Invalid Slider</FieldLabel>
          <Slider
            id="slider-invalid"
            defaultValue={[30]}
            max={100}
            aria-invalid
          />
          <FieldDescription>
            This slider has validation errors.
          </FieldDescription>
        </Field>
        <Field data-disabled>
          <FieldLabel htmlFor="slider-disabled-field">
            Disabled Slider
          </FieldLabel>
          <Slider
            id="slider-disabled-field"
            defaultValue={[50]}
            max={100}
            disabled
          />
          <FieldDescription>
            This slider is currently disabled.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </Example>
  )
}

function InputOTPFields() {
  const [value, setValue] = useState("")
  const [pinValue, setPinValue] = useState("")

  return (
    <Example title="OTP Input Fields">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="otp-basic">Verification Code</FieldLabel>
          <InputOTP id="otp-basic" maxLength={6}>
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
          <FieldLabel htmlFor="otp-pin">PIN Code</FieldLabel>
          <InputOTP
            id="otp-pin"
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
        <Field data-invalid>
          <FieldLabel htmlFor="otp-invalid">Invalid OTP</FieldLabel>
          <InputOTP id="otp-invalid" maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} aria-invalid />
              <InputOTPSlot index={1} aria-invalid />
              <InputOTPSlot index={2} aria-invalid />
              <InputOTPSlot index={3} aria-invalid />
              <InputOTPSlot index={4} aria-invalid />
              <InputOTPSlot index={5} aria-invalid />
            </InputOTPGroup>
          </InputOTP>
          <FieldDescription>
            This OTP field contains validation errors.
          </FieldDescription>
        </Field>
        <Field data-disabled>
          <FieldLabel htmlFor="otp-disabled-field">Disabled OTP</FieldLabel>
          <InputOTP id="otp-disabled-field" maxLength={6} disabled>
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
            This OTP field is currently disabled.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </Example>
  )
}
