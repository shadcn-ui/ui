import { Checkbox } from '@/ember-ui/checkbox';
import { Label } from '@/ember-ui/label';

<template>
  <div class="flex gap-2" dir="rtl">
    <Checkbox id="terms-rtl" />
    <Label @for="terms-rtl">قبول الشروط والأحكام</Label>
  </div>
</template>
