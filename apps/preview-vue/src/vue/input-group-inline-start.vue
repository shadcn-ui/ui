<script setup lang="ts">
import SearchIcon from "@material-symbols/svg-400/rounded/search.svg?component"
import { Field, FieldDescription, FieldLabel } from '@/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/ui/input-group'
</script>

<template>
  <Field class="max-w-sm">
    <FieldLabel for="inline-start-input">Input</FieldLabel>
    <InputGroup>
      <InputGroupInput id="inline-start-input" placeholder="Search..." />
      <InputGroupAddon align="inline-start">
        <SearchIcon class="text-muted-foreground" />
      </InputGroupAddon>
    </InputGroup>
    <FieldDescription>Icon positioned at the start.</FieldDescription>
  </Field>
</template>
