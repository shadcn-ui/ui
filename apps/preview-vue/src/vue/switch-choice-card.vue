<script setup lang="ts">
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/ui/field'
import { Switch } from '@/ui/switch'
</script>

<template>
  <FieldGroup class="w-full max-w-sm">
    <FieldLabel for="switch-share">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Share across devices</FieldTitle>
          <FieldDescription>
            Focus is shared across devices, and turns off when you leave the
            app.
          </FieldDescription>
        </FieldContent>
        <Switch id="switch-share" />
      </Field>
    </FieldLabel>
    <FieldLabel for="switch-notifications">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Enable notifications</FieldTitle>
          <FieldDescription>
            Receive notifications when focus mode is enabled or disabled.
          </FieldDescription>
        </FieldContent>
        <Switch id="switch-notifications" :default-checked="true" />
      </Field>
    </FieldLabel>
  </FieldGroup>
</template>
