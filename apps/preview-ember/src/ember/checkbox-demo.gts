import { Checkbox } from '@/ember-ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/ember-ui/field';
import { Label } from '@/ember-ui/label';

<template>
  <FieldGroup class="max-w-sm">
    <Field @orientation="horizontal">
      <Checkbox id="terms-checkbox" name="terms-checkbox" />
      <Label @for="terms-checkbox">Accept terms and conditions</Label>
    </Field>
    <Field @orientation="horizontal">
      <Checkbox @checked={{true}} id="terms-checkbox-2" name="terms-checkbox-2" />
      <FieldContent>
        <FieldLabel @for="terms-checkbox-2">
          Accept terms and conditions
        </FieldLabel>
        <FieldDescription>
          By clicking this checkbox, you agree to the terms.
        </FieldDescription>
      </FieldContent>
    </Field>
    <Field @orientation="horizontal" data-disabled>
      <Checkbox @disabled={{true}} id="toggle-checkbox" name="toggle-checkbox" />
      <FieldLabel @for="toggle-checkbox">Enable notifications</FieldLabel>
    </Field>
    <FieldLabel>
      <Field @orientation="horizontal">
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
