<script setup lang="ts">
import { ref } from 'vue'
import {
  Label,
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@saaze/ui'

const quantity = ref(3)
const price = ref(1250000)
</script>

<template>
  <div class="grid w-full max-w-xs gap-6">
    <NumberField id="quantity" v-model="quantity" :min="1" :max="20">
      <Label for="quantity">تعداد</Label>
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>

    <NumberField
      id="price"
      v-model="price"
      :step="50000"
      :min="0"
      :format-options="{
        style: 'currency',
        currency: 'IRR',
        currencyDisplay: 'name',
        maximumFractionDigits: 0,
      }"
    >
      <Label for="price">مبلغ</Label>
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  </div>
</template>
