<script setup lang="ts">
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/ui/field'
import { Input } from '@/ui/input'
</script>

<template>
  <div class="w-full max-w-md">
    <FieldSet>
      <FieldGroup>
        <Field>
          <FieldLabel for="username">
            Username
          </FieldLabel>
          <Input id="username" type="text" placeholder="Max Leiter" />
          <FieldDescription>
            Choose a unique username for your account.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel for="password">
            Password
          </FieldLabel>
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
          <Input id="password" type="password" placeholder="********" />
        </Field>
      </FieldGroup>
    </FieldSet>
  </div>
</template>
