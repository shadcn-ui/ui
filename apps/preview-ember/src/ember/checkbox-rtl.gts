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
  <FieldGroup class="max-w-sm" dir="rtl">
    <Field @orientation="horizontal">
      <Checkbox id="terms-checkbox-rtl" name="terms-checkbox" />
      <Label @for="terms-checkbox-rtl">قبول الشروط والأحكام</Label>
    </Field>
    <Field @orientation="horizontal">
      <Checkbox
        @checked={{true}}
        id="terms-checkbox-2-rtl"
        name="terms-checkbox-2"
      />
      <FieldContent>
        <FieldLabel @for="terms-checkbox-2-rtl">
          قبول الشروط والأحكام
        </FieldLabel>
        <FieldDescription>
          بالنقر على هذا المربع، فإنك توافق على الشروط.
        </FieldDescription>
      </FieldContent>
    </Field>
    <Field @orientation="horizontal" data-disabled>
      <Checkbox @disabled={{true}} id="toggle-checkbox-rtl" name="toggle-checkbox" />
      <FieldLabel @for="toggle-checkbox-rtl">تفعيل الإشعارات</FieldLabel>
    </Field>
    <FieldLabel>
      <Field @orientation="horizontal">
        <Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2" />
        <FieldContent>
          <FieldTitle>تفعيل الإشعارات</FieldTitle>
          <FieldDescription>
            يمكنك تفعيل أو إلغاء تفعيل الإشعارات في أي وقت.
          </FieldDescription>
        </FieldContent>
      </Field>
    </FieldLabel>
  </FieldGroup>
</template>
