import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/ember-ui/field';
import { RadioGroup, RadioGroupItem } from '@/ember-ui/radio-group';

<template>
  <RadioGroup @defaultValue="comfortable" class="w-fit" dir="rtl">
    <Field @orientation="horizontal">
      <RadioGroupItem @value="default" id="r1-rtl" dir="rtl" />
      <FieldContent>
        <FieldLabel @for="r1-rtl" dir="rtl">افتراضي</FieldLabel>
        <FieldDescription dir="rtl">تباعد قياسي لمعظم حالات الاستخدام.</FieldDescription>
      </FieldContent>
    </Field>
    <Field @orientation="horizontal">
      <RadioGroupItem @value="comfortable" id="r2-rtl" dir="rtl" />
      <FieldContent>
        <FieldLabel @for="r2-rtl" dir="rtl">مريح</FieldLabel>
        <FieldDescription dir="rtl">مساحة أكبر بين العناصر.</FieldDescription>
      </FieldContent>
    </Field>
    <Field @orientation="horizontal">
      <RadioGroupItem @value="compact" id="r3-rtl" dir="rtl" />
      <FieldContent>
        <FieldLabel @for="r3-rtl" dir="rtl">مضغوط</FieldLabel>
        <FieldDescription dir="rtl">تباعد أدنى للتخطيطات الكثيفة.</FieldDescription>
      </FieldContent>
    </Field>
  </RadioGroup>
</template>
