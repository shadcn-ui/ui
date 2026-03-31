<script setup lang="ts">
import { Example } from "@/components"
import { Checkbox } from "@/ui/checkbox"
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
</script>

<template>
  <Example title="Checkbox Fields">
    <FieldGroup>
      <Field orientation="horizontal">
        <Checkbox id="checkbox-basic" :default-checked="true" />
        <FieldLabel html-for="checkbox-basic" class="font-normal">
          I agree to the terms and conditions
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <FieldLabel html-for="checkbox-right">
          Accept terms and conditions
        </FieldLabel>
        <Checkbox id="checkbox-right" />
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="checkbox-with-desc" />
        <FieldContent>
          <FieldLabel html-for="checkbox-with-desc">
            Subscribe to newsletter
          </FieldLabel>
          <FieldDescription>
            Receive weekly updates about new features and promotions.
          </FieldDescription>
        </FieldContent>
      </Field>
      <FieldLabel html-for="checkbox-with-title">
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
        <FieldLegend variant="label">
          Preferences
        </FieldLegend>
        <FieldDescription>
          Select all that apply to customize your experience.
        </FieldDescription>
        <FieldGroup class="gap-3">
          <Field orientation="horizontal">
            <Checkbox id="pref-dark" />
            <FieldLabel html-for="pref-dark" class="font-normal">
              Dark mode
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="pref-compact" />
            <FieldLabel html-for="pref-compact" class="font-normal">
              Compact view
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="pref-notifications" />
            <FieldLabel html-for="pref-notifications" class="font-normal">
              Enable notifications
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
      <Field data-invalid orientation="horizontal">
        <Checkbox id="checkbox-invalid" :aria-invalid="true" />
        <FieldLabel html-for="checkbox-invalid" class="font-normal">
          Invalid checkbox
        </FieldLabel>
      </Field>
      <Field data-disabled orientation="horizontal">
        <Checkbox id="checkbox-disabled-field" disabled />
        <FieldLabel html-for="checkbox-disabled-field" class="font-normal">
          Disabled checkbox
        </FieldLabel>
      </Field>
    </FieldGroup>
  </Example>
</template>
