<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Label } from "@/ui/label"
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/ui/number-field"
import { Example } from "@/components"
</script>

<template>
  <Example title="Number Field with Label">
    <div class="grid w-full max-w-sm items-center gap-1.5">
      <Label html-for="quantity">Quantity</Label>
      <NumberField id="quantity" :default-value="5" :min="1" :max="50">
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
    </div>
  </Example>
</template>
