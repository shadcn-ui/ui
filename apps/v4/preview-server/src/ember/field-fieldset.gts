import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/ember-ui/field';
import { Input } from '@/ember-ui/input';

<template>
  <div class="w-full max-w-md space-y-6">
    <FieldSet>
      <FieldLegend>Address Information</FieldLegend>
      <FieldDescription>
        We need your address to deliver your order.
      </FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel @for="street">Street Address</FieldLabel>
          <Input id="street" placeholder="123 Main St" type="text" />
        </Field>
        <div class="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel @for="city">City</FieldLabel>
            <Input id="city" placeholder="New York" type="text" />
          </Field>
          <Field>
            <FieldLabel @for="zip">Postal Code</FieldLabel>
            <Input id="zip" placeholder="90502" type="text" />
          </Field>
        </div>
      </FieldGroup>
    </FieldSet>
  </div>
</template>
