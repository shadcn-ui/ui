import { Field, FieldLabel } from '@/ember-ui/field';
import { RadioGroup, RadioGroupItem } from '@/ember-ui/radio-group';

<template>
  <RadioGroup @defaultValue="option2" class="w-fit">
    <Field @orientation="horizontal" data-disabled>
      <RadioGroupItem @value="option1" id="disabled-1" @disabled={{true}} />
      <FieldLabel @for="disabled-1" class="font-normal">Disabled</FieldLabel>
    </Field>
    <Field @orientation="horizontal">
      <RadioGroupItem @value="option2" id="disabled-2" />
      <FieldLabel @for="disabled-2" class="font-normal">Option 2</FieldLabel>
    </Field>
    <Field @orientation="horizontal">
      <RadioGroupItem @value="option3" id="disabled-3" />
      <FieldLabel @for="disabled-3" class="font-normal">Option 3</FieldLabel>
    </Field>
  </RadioGroup>
</template>
