import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/ember-ui/field';
import { Input } from '@/ember-ui/input';

<template>
  <Field dir="rtl">
    <FieldLabel @for="input-rtl-api-key">مفتاح API</FieldLabel>
    <Input
      id="input-rtl-api-key"
      type="password"
      placeholder="sk-..."
      dir="rtl"
    />
    <FieldDescription>مفتاح API الخاص بك مشفر ومخزن بأمان.</FieldDescription>
  </Field>
</template>
