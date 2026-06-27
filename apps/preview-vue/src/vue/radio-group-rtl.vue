<script setup lang="ts">
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/ui/field'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/ui/radio-group'
</script>

<template>
  <RadioGroup default-value="comfortable" class="w-fit" dir="rtl">
    <Field orientation="horizontal">
      <RadioGroupItem id="r1-rtl" value="default" dir="rtl" />
      <FieldContent>
        <FieldLabel for="r1-rtl" dir="rtl">افتراضي</FieldLabel>
        <FieldDescription dir="rtl">تباعد قياسي لمعظم حالات الاستخدام.</FieldDescription>
      </FieldContent>
    </Field>
    <Field orientation="horizontal">
      <RadioGroupItem id="r2-rtl" value="comfortable" dir="rtl" />
      <FieldContent>
        <FieldLabel for="r2-rtl" dir="rtl">مريح</FieldLabel>
        <FieldDescription dir="rtl">مساحة أكبر بين العناصر.</FieldDescription>
      </FieldContent>
    </Field>
    <Field orientation="horizontal">
      <RadioGroupItem id="r3-rtl" value="compact" dir="rtl" />
      <FieldContent>
        <FieldLabel for="r3-rtl" dir="rtl">مضغوط</FieldLabel>
        <FieldDescription dir="rtl">تباعد أدنى للتخطيطات الكثيفة.</FieldDescription>
      </FieldContent>
    </Field>
  </RadioGroup>
</template>
