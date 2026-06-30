<script setup lang="ts">
import { ref } from 'vue'

import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/ui/field'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/ui/toggle-group'

const fontWeight = ref('normal')
</script>

<template>
  <Field>
    <FieldLabel>Font Weight</FieldLabel>
    <ToggleGroup
      type="single"
      :value="fontWeight"
      @value-change="(value: string) => fontWeight = value"
      variant="outline"
      :spacing="2"
      size="lg"
    >
      <ToggleGroupItem
        value="light"
        aria-label="Light"
        class="flex size-16 flex-col items-center justify-center rounded-xl"
      >
        <span class="text-2xl leading-none font-light">Aa</span>
        <span class="text-xs text-muted-foreground">Light</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="normal"
        aria-label="Normal"
        class="flex size-16 flex-col items-center justify-center rounded-xl"
      >
        <span class="text-2xl leading-none font-normal">Aa</span>
        <span class="text-xs text-muted-foreground">Normal</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="medium"
        aria-label="Medium"
        class="flex size-16 flex-col items-center justify-center rounded-xl"
      >
        <span class="text-2xl leading-none font-medium">Aa</span>
        <span class="text-xs text-muted-foreground">Medium</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="bold"
        aria-label="Bold"
        class="flex size-16 flex-col items-center justify-center rounded-xl"
      >
        <span class="text-2xl leading-none font-bold">Aa</span>
        <span class="text-xs text-muted-foreground">Bold</span>
      </ToggleGroupItem>
    </ToggleGroup>
    <FieldDescription>
      Use
      <code class="rounded-md bg-muted px-1 py-0.5 font-mono">font-{{ fontWeight }}</code>
      to set the font weight.
    </FieldDescription>
  </Field>
</template>
