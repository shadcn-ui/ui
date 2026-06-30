import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/ember-ui/field';
import { RadioGroup, RadioGroupItem } from '@/ember-ui/radio-group';

<template>
  <FieldSet class="w-full max-w-xs">
    <FieldLegend @variant="label">Notification Preferences</FieldLegend>
    <FieldDescription>Choose how you want to receive notifications.</FieldDescription>
    <RadioGroup @defaultValue="email">
      <Field @orientation="horizontal" data-invalid>
        <RadioGroupItem @value="email" id="invalid-email" aria-invalid="true" />
        <FieldLabel @for="invalid-email" class="font-normal">Email only</FieldLabel>
      </Field>
      <Field @orientation="horizontal" data-invalid>
        <RadioGroupItem @value="sms" id="invalid-sms" aria-invalid="true" />
        <FieldLabel @for="invalid-sms" class="font-normal">SMS only</FieldLabel>
      </Field>
      <Field @orientation="horizontal" data-invalid>
        <RadioGroupItem @value="both" id="invalid-both" aria-invalid="true" />
        <FieldLabel @for="invalid-both" class="font-normal">Both Email &amp; SMS</FieldLabel>
      </Field>
    </RadioGroup>
  </FieldSet>
</template>
