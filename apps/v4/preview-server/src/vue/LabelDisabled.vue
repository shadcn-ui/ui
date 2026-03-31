<script setup lang="ts">
import { Example } from "@/components"
import { Field } from "@/ui/field"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
</script>

<template>
  <Example title="Disabled">
    <Field :data-disabled="true">
      <Label html-for="label-demo-disabled">
        Disabled
      </Label>
      <Input id="label-demo-disabled" placeholder="Disabled" disabled />
    </Field>
  </Example>
</template>
