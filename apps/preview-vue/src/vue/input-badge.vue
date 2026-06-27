<script setup lang="ts">
import { Badge } from '@/ui/badge'
import { Field, FieldLabel } from '@/ui/field'
import { Input } from '@/ui/input'
</script>

<template>
  <Field>
    <FieldLabel for="input-badge">
      Webhook URL
      <Badge variant="secondary" class="ml-auto">
        Beta
      </Badge>
    </FieldLabel>
    <Input
      id="input-badge"
      type="url"
      placeholder="https://api.example.com/webhook"
    />
  </Field>
</template>
