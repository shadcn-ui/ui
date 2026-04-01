import { Label } from '@/ember-ui/label';
import { RadioGroup, RadioGroupItem } from '@/ember-ui/radio-group';

<template>
  <RadioGroup @defaultValue="comfortable">
    <div class="flex items-center gap-3">
      <RadioGroupItem @value="default" id="r1" />
      <Label @for="r1">Default</Label>
    </div>
    <div class="flex items-center gap-3">
      <RadioGroupItem @value="comfortable" id="r2" />
      <Label @for="r2">Comfortable</Label>
    </div>
    <div class="flex items-center gap-3">
      <RadioGroupItem @value="compact" id="r3" />
      <Label @for="r3">Compact</Label>
    </div>
  </RadioGroup>
</template>
