<script setup lang="ts">
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/ui/field'
import { Input } from '@/ui/input'
</script>

<template>
  <div class="w-full max-w-md space-y-6">
    <FieldSet>
      <FieldLegend>Address Information</FieldLegend>
      <FieldDescription>
        We need your address to deliver your order.
      </FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel for="street">
            Street Address
          </FieldLabel>
          <Input id="street" type="text" placeholder="123 Main St" />
        </Field>
        <div class="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel for="city">
              City
            </FieldLabel>
            <Input id="city" type="text" placeholder="New York" />
          </Field>
          <Field>
            <FieldLabel for="zip">
              Postal Code
            </FieldLabel>
            <Input id="zip" type="text" placeholder="90502" />
          </Field>
        </div>
      </FieldGroup>
    </FieldSet>
  </div>
</template>
