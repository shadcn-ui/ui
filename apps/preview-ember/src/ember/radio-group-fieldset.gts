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
    <FieldLegend @variant="label">Subscription Plan</FieldLegend>
    <FieldDescription>Yearly and lifetime plans offer significant savings.</FieldDescription>
    <RadioGroup @defaultValue="monthly">
      <Field @orientation="horizontal">
        <RadioGroupItem @value="monthly" id="plan-monthly" />
        <FieldLabel @for="plan-monthly" class="font-normal">
          Monthly ($9.99/month)
        </FieldLabel>
      </Field>
      <Field @orientation="horizontal">
        <RadioGroupItem @value="yearly" id="plan-yearly" />
        <FieldLabel @for="plan-yearly" class="font-normal">
          Yearly ($99.99/year)
        </FieldLabel>
      </Field>
      <Field @orientation="horizontal">
        <RadioGroupItem @value="lifetime" id="plan-lifetime" />
        <FieldLabel @for="plan-lifetime" class="font-normal">
          Lifetime ($299.99)
        </FieldLabel>
      </Field>
    </RadioGroup>
  </FieldSet>
</template>
