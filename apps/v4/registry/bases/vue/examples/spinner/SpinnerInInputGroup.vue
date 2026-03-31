<script setup lang="ts">
import { Example } from "@/components/example"
import { Field, FieldLabel } from "@/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/ui/input-group"
import { Spinner } from "@/ui/spinner"
</script>

<template>
  <Example title="In Input Group">
    <Field>
      <FieldLabel html-for="input-group-spinner">
        Input Group
      </FieldLabel>
      <InputGroup>
        <InputGroupInput id="input-group-spinner" />
        <InputGroupAddon>
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  </Example>
</template>
