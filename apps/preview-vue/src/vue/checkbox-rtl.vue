<script setup lang="ts">
import { ref } from 'vue'
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

const dir = ref<'ltr' | 'rtl'>('rtl')
</script>

<template>
  <FieldGroup class="max-w-sm" :dir="dir">
    <Field orientation="horizontal">
      <Checkbox id="terms-checkbox-rtl" name="terms-checkbox" />
      <Label for="terms-checkbox-rtl">قبول الشروط والأحكام</Label>
    </Field>
    <Field orientation="horizontal">
      <Checkbox
        id="terms-checkbox-2-rtl"
        name="terms-checkbox-2"
        :default-value="true"
      />
      <FieldContent>
        <FieldLabel for="terms-checkbox-2-rtl">
          قبول الشروط والأحكام
        </FieldLabel>
        <FieldDescription>
          بالنقر على هذا المربع، فإنك توافق على الشروط.
        </FieldDescription>
      </FieldContent>
    </Field>
    <Field orientation="horizontal" data-disabled>
      <Checkbox id="toggle-checkbox-rtl" name="toggle-checkbox" disabled />
      <FieldLabel for="toggle-checkbox-rtl">
        تفعيل الإشعارات
      </FieldLabel>
    </Field>
    <FieldLabel>
      <Field orientation="horizontal">
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
