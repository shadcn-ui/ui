<script setup lang="ts">
import { Checkbox } from '@/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/ui/field'
import { Label } from '@/ui/label'
</script>

<template>
  <FieldGroup class="max-w-sm">
    <Field orientation="horizontal">
      <Checkbox id="terms-checkbox" name="terms-checkbox" />
      <Label for="terms-checkbox">Accept terms and conditions</Label>
    </Field>
    <Field orientation="horizontal">
      <Checkbox
        id="terms-checkbox-2"
        name="terms-checkbox-2"
        :default-value="true"
      />
      <FieldContent>
        <FieldLabel for="terms-checkbox-2">
          Accept terms and conditions
        </FieldLabel>
        <FieldDescription>
          By clicking this checkbox, you agree to the terms.
        </FieldDescription>
      </FieldContent>
    </Field>
    <Field orientation="horizontal" data-disabled>
      <Checkbox id="toggle-checkbox" name="toggle-checkbox" disabled />
      <FieldLabel for="toggle-checkbox">Enable notifications</FieldLabel>
    </Field>
    <FieldLabel>
      <Field orientation="horizontal">
        <Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2" />
        <FieldContent>
          <FieldTitle>Enable notifications</FieldTitle>
          <FieldDescription>
            You can enable or disable notifications at any time.
          </FieldDescription>
        </FieldContent>
      </Field>
    </FieldLabel>
  </FieldGroup>
</template>
