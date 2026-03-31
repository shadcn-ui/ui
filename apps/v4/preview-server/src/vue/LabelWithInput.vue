<script setup lang="ts">
import { Example } from "@/components"
import { Field } from "@/ui/field"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
</script>

<template>
  <Example title="With Input">
    <Field>
      <Label html-for="label-demo-username">Username</Label>
      <Input id="label-demo-username" placeholder="Username" />
    </Field>
  </Example>
</template>
