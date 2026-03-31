<script setup lang="ts">
import { Field, FieldLabel } from "@/ui/field"
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group"
</script>

<template>
  <RadioGroup default-value="medium" class="grid grid-cols-2 gap-2">
    <FieldLabel html-for="size-small">
      <Field orientation="horizontal">
        <RadioGroupItem id="size-small" value="small" />
        <div class="font-medium">
          Small
        </div>
      </Field>
    </FieldLabel>
    <FieldLabel html-for="size-medium">
      <Field orientation="horizontal">
        <RadioGroupItem id="size-medium" value="medium" />
        <div class="font-medium">
          Medium
        </div>
      </Field>
    </FieldLabel>
    <FieldLabel html-for="size-large">
      <Field orientation="horizontal">
        <RadioGroupItem id="size-large" value="large" />
        <div class="font-medium">
          Large
        </div>
      </Field>
    </FieldLabel>
    <FieldLabel html-for="size-xlarge">
      <Field orientation="horizontal">
        <RadioGroupItem id="size-xlarge" value="xlarge" />
        <div class="font-medium">
          X-Large
        </div>
      </Field>
    </FieldLabel>
  </RadioGroup>
</template>
