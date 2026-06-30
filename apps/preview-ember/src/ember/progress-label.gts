import { Field, FieldLabel } from '@/ember-ui/field';
import { Progress } from '@/ember-ui/progress';

<template>
  <Field @class="w-full max-w-sm">
    <FieldLabel @for="progress-upload">
      <span>Upload progress</span>
      <span class="ml-auto">66%</span>
    </FieldLabel>
    <Progress @value={{66}} id="progress-upload" />
  </Field>
</template>
