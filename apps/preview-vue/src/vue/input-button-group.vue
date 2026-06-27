<script setup lang="ts">
import { Button } from '@/ui/button'
import { ButtonGroup } from '@/ui/button-group'
import { Field, FieldLabel } from '@/ui/field'
import { Input } from '@/ui/input'
</script>

<template>
  <Field>
    <FieldLabel for="input-button-group">Search</FieldLabel>
    <ButtonGroup>
      <Input id="input-button-group" placeholder="Type to search..." />
      <Button variant="outline">Search</Button>
    </ButtonGroup>
  </Field>
</template>
