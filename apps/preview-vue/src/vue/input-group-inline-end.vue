<script setup lang="ts">
import EyeOffIcon from "@material-symbols/svg-400/rounded/visibility_off.svg?component"
import { Field, FieldDescription, FieldLabel } from '@/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/ui/input-group'
</script>

<template>
  <Field class="max-w-sm">
    <FieldLabel for="inline-end-input">Input</FieldLabel>
    <InputGroup>
      <InputGroupInput
        id="inline-end-input"
        type="password"
        placeholder="Enter password"
      />
      <InputGroupAddon align="inline-end">
        <EyeOffIcon />
      </InputGroupAddon>
    </InputGroup>
    <FieldDescription>Icon positioned at the end.</FieldDescription>
  </Field>
</template>
