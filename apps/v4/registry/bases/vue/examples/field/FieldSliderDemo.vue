<script setup lang="ts">
import { ref } from 'vue'
import {
  Field,
  FieldDescription,
  FieldTitle,
} from '@/ui/field'
import { Slider } from '@/ui/slider'

const value = ref([200, 800])
</script>

<template>
  <div class="w-full max-w-md">
    <Field>
      <FieldTitle>Price Range</FieldTitle>
      <FieldDescription>
        Set your budget range ($
        <span class="font-medium tabular-nums">{{ value[0] }}</span> -
        <span class="font-medium tabular-nums">{{ value[1] }}</span>).
      </FieldDescription>
      <Slider
        v-model="value"
        :max="1000"
        :min="0"
        :step="10"
        class="mt-2 w-full"
        aria-label="Price Range"
      />
    </Field>
  </div>
</template>
