<script setup lang="ts">
import InfoIcon from "@material-symbols/svg-400/rounded/info.svg?component"
import { Field, FieldLabel } from '@/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/ui/input-group'
</script>

<template>
  <Field>
    <FieldLabel for="input-group-url">Website URL</FieldLabel>
    <InputGroup>
      <InputGroupInput id="input-group-url" placeholder="example.com" />
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InfoIcon />
      </InputGroupAddon>
    </InputGroup>
  </Field>
</template>
