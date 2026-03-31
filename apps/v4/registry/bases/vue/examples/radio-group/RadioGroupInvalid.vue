<script setup lang="ts">
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/ui/field"
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group"
</script>

<template>
  <FieldSet>
    <FieldLegend>Notification Preferences</FieldLegend>
    <FieldDescription>
      Choose how you want to receive notifications.
    </FieldDescription>
    <RadioGroup default-value="email">
      <Field orientation="horizontal" data-invalid>
        <RadioGroupItem id="invalid-email" value="email" :aria-invalid="true" />
        <FieldLabel html-for="invalid-email" class="font-normal">
          Email only
        </FieldLabel>
      </Field>
      <Field orientation="horizontal" data-invalid>
        <RadioGroupItem id="invalid-sms" value="sms" :aria-invalid="true" />
        <FieldLabel html-for="invalid-sms" class="font-normal">
          SMS only
        </FieldLabel>
      </Field>
      <Field orientation="horizontal" data-invalid>
        <RadioGroupItem id="invalid-both" value="both" :aria-invalid="true" />
        <FieldLabel html-for="invalid-both" class="font-normal">
          Both Email & SMS
        </FieldLabel>
      </Field>
    </RadioGroup>
  </FieldSet>
</template>
