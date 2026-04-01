import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '@/ember-ui/field';
import { RadioGroup, RadioGroupItem } from '@/ember-ui/radio-group';

<template>
  <div class="w-full max-w-md">
    <FieldSet>
      <FieldLabel>Subscription Plan</FieldLabel>
      <FieldDescription>
        Yearly and lifetime plans offer significant savings.
      </FieldDescription>
      <RadioGroup @defaultValue="monthly">
        <Field @orientation="horizontal">
          <RadioGroupItem @value="monthly" id="plan-monthly" />
          <FieldLabel @class="font-normal" @for="plan-monthly">
            Monthly ($9.99/month)
          </FieldLabel>
        </Field>
        <Field @orientation="horizontal">
          <RadioGroupItem @value="yearly" id="plan-yearly" />
          <FieldLabel @class="font-normal" @for="plan-yearly">
            Yearly ($99.99/year)
          </FieldLabel>
        </Field>
        <Field @orientation="horizontal">
          <RadioGroupItem @value="lifetime" id="plan-lifetime" />
          <FieldLabel @class="font-normal" @for="plan-lifetime">
            Lifetime ($299.99)
          </FieldLabel>
        </Field>
      </RadioGroup>
    </FieldSet>
  </div>
</template>
