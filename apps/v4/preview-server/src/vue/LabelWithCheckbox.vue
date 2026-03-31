<script setup lang="ts">
import { Example } from "@/components"
import { Checkbox } from "@/ui/checkbox"
import { Field } from "@/ui/field"
import { Label } from "@/ui/label"
</script>

<template>
  <Example title="With Checkbox">
    <Field orientation="horizontal">
      <Checkbox id="label-demo-terms" />
      <Label html-for="label-demo-terms">
        Accept terms and conditions
      </Label>
    </Field>
  </Example>
</template>
