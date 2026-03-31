<script setup lang="ts">
import { Field, FieldLabel } from "@/ui/field"
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group"
</script>

<template>
  <RadioGroup default-value="option2" :disabled="true">
    <Field orientation="horizontal">
      <RadioGroupItem id="disabled-1" value="option1" />
      <FieldLabel html-for="disabled-1" class="font-normal">
        Option 1
      </FieldLabel>
    </Field>
    <Field orientation="horizontal">
      <RadioGroupItem id="disabled-2" value="option2" />
      <FieldLabel html-for="disabled-2" class="font-normal">
        Option 2
      </FieldLabel>
    </Field>
    <Field orientation="horizontal">
      <RadioGroupItem id="disabled-3" value="option3" />
      <FieldLabel html-for="disabled-3" class="font-normal">
        Option 3
      </FieldLabel>
    </Field>
  </RadioGroup>
</template>
