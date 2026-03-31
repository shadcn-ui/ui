<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/ui/number-field"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="Disabled Number Field">
    <NumberField :default-value="10" :min="0" :max="100" :disabled="true">
      <NumberFieldContent>
        <NumberFieldDecrement>
          <IconPlaceholder
            lucide="MinusIcon"
            tabler="IconMinus"
            hugeicons="RemoveCircleIcon"
            phosphor="MinusIcon"
            remixicon="RiSubtractLine"
          />
        </NumberFieldDecrement>
        <NumberFieldInput />
        <NumberFieldIncrement>
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="AddCircleIcon"
            phosphor="PlusIcon"
            remixicon="RiAddLine"
          />
        </NumberFieldIncrement>
      </NumberFieldContent>
    </NumberField>
  </Example>
</template>
