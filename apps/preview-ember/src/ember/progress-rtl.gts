import { Field, FieldLabel } from '@/ember-ui/field';
import { Progress } from '@/ember-ui/progress';

<template>
  <Field @class="w-full max-w-sm" dir="rtl">
    <FieldLabel @for="progress-upload-rtl">
      <span>تقدم الرفع</span>
      <span class="ms-auto">٦٦%</span>
    </FieldLabel>
    <Progress @value={{66}} id="progress-upload-rtl" @class="rtl:rotate-180" />
  </Field>
</template>
