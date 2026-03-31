<script setup lang="ts">
import { Example } from "@/components/example"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/ui/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/ui/radio-group"
</script>

<template>
  <Example title="Radio Fields">
    <FieldGroup>
      <FieldSet>
        <FieldLegend variant="label">
          Subscription Plan
        </FieldLegend>
        <RadioGroup default-value="free">
          <Field orientation="horizontal">
            <RadioGroupItem id="radio-free" value="free" />
            <FieldLabel html-for="radio-free" class="font-normal">
              Free Plan
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem id="radio-pro" value="pro" />
            <FieldLabel html-for="radio-pro" class="font-normal">
              Pro Plan
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem id="radio-enterprise" value="enterprise" />
            <FieldLabel html-for="radio-enterprise" class="font-normal">
              Enterprise
            </FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label">
          Battery Level
        </FieldLegend>
        <FieldDescription>
          Choose your preferred battery level.
        </FieldDescription>
        <RadioGroup>
          <Field orientation="horizontal">
            <RadioGroupItem id="battery-high" value="high" />
            <FieldLabel html-for="battery-high">
              High
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem id="battery-medium" value="medium" />
            <FieldLabel html-for="battery-medium">
              Medium
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem id="battery-low" value="low" />
            <FieldLabel html-for="battery-low">
              Low
            </FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
      <RadioGroup class="gap-6">
        <Field orientation="horizontal">
          <RadioGroupItem id="radio-content-1" value="option1" />
          <FieldContent>
            <FieldLabel html-for="radio-content-1">
              Enable Touch ID
            </FieldLabel>
            <FieldDescription>
              Enable Touch ID to quickly unlock your device.
            </FieldDescription>
          </FieldContent>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem id="radio-content-2" value="option2" />
          <FieldContent>
            <FieldLabel html-for="radio-content-2">
              Enable Touch ID and Face ID to make it even faster to unlock
              your device. This is a long label to test the layout.
            </FieldLabel>
            <FieldDescription>
              Enable Touch ID to quickly unlock your device.
            </FieldDescription>
          </FieldContent>
        </Field>
      </RadioGroup>
      <RadioGroup class="gap-3">
        <FieldLabel html-for="radio-title-1">
          <Field orientation="horizontal">
            <RadioGroupItem id="radio-title-1" value="title1" />
            <FieldContent>
              <FieldTitle>Enable Touch ID</FieldTitle>
              <FieldDescription>
                Enable Touch ID to quickly unlock your device.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
        <FieldLabel html-for="radio-title-2">
          <Field orientation="horizontal">
            <RadioGroupItem id="radio-title-2" value="title2" />
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
        <FieldLegend variant="label">
          Invalid Radio Group
        </FieldLegend>
        <RadioGroup>
          <Field data-invalid orientation="horizontal">
            <RadioGroupItem
              id="radio-invalid-1"
              value="invalid1"
              :aria-invalid="true"
            />
            <FieldLabel html-for="radio-invalid-1">
              Invalid Option 1
            </FieldLabel>
          </Field>
          <Field data-invalid orientation="horizontal">
            <RadioGroupItem
              id="radio-invalid-2"
              value="invalid2"
              :aria-invalid="true"
            />
            <FieldLabel html-for="radio-invalid-2">
              Invalid Option 2
            </FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label">
          Disabled Radio Group
        </FieldLegend>
        <RadioGroup :disabled="true">
          <Field data-disabled orientation="horizontal">
            <RadioGroupItem
              id="radio-disabled-1"
              value="disabled1"
              disabled
            />
            <FieldLabel html-for="radio-disabled-1">
              Disabled Option 1
            </FieldLabel>
          </Field>
          <Field data-disabled orientation="horizontal">
            <RadioGroupItem
              id="radio-disabled-2"
              value="disabled2"
              disabled
            />
            <FieldLabel html-for="radio-disabled-2">
              Disabled Option 2
            </FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
    </FieldGroup>
  </Example>
</template>
