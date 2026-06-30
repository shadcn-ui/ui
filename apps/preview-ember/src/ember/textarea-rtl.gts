import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/ember-ui/field';
import { Textarea } from '@/ember-ui/textarea';

<template>
  <Field @class="w-full max-w-xs" dir="rtl">
    <FieldLabel @for="feedback" dir="rtl">التعليقات</FieldLabel>
    <Textarea
      id="feedback"
      placeholder="تعليقاتك تساعدنا على التحسين..."
      dir="rtl"
      rows="4"
    />
    <FieldDescription dir="rtl">شاركنا أفكارك حول خدمتنا.</FieldDescription>
  </Field>
</template>
