<script setup lang="ts">
import { Checkbox } from "@/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/ui/field"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="With Description">
    <Field orientation="horizontal">
      <Checkbox id="terms-2" :default-checked="true" />
      <FieldContent>
        <FieldLabel html-for="terms-2">
          Accept terms and conditions
        </FieldLabel>
        <FieldDescription>
          By clicking this checkbox, you agree to the terms and conditions.
        </FieldDescription>
      </FieldContent>
    </Field>
  </Example>
</template>
