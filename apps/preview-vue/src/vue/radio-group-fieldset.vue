<script setup lang="ts">
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/ui/field'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/ui/radio-group'
</script>

<template>
  <FieldSet class="w-full max-w-xs">
    <FieldLegend variant="label">Subscription Plan</FieldLegend>
    <FieldDescription>Yearly and lifetime plans offer significant savings.</FieldDescription>
    <RadioGroup default-value="monthly">
      <Field orientation="horizontal">
        <RadioGroupItem id="plan-monthly" value="monthly" />
        <FieldLabel for="plan-monthly" class="font-normal">
          Monthly ($9.99/month)
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem id="plan-yearly" value="yearly" />
        <FieldLabel for="plan-yearly" class="font-normal">
          Yearly ($99.99/year)
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem id="plan-lifetime" value="lifetime" />
        <FieldLabel for="plan-lifetime" class="font-normal">
          Lifetime ($299.99)
        </FieldLabel>
      </Field>
    </RadioGroup>
  </FieldSet>
</template>
