<script setup lang="ts">
import { ref } from 'vue'
import { PinInput, PinInputGroup, PinInputSeparator, PinInputSlot } from '@saaze/ui'

const pin = ref<string[]>([])
const completed = ref('')
</script>

<template>
  <div class="grid justify-items-center gap-3">
    <PinInput
      v-model="pin"
      type="number"
      placeholder="○"
      aria-label="رمز چهاررقمی"
      @complete="completed = $event.join('')"
    >
      <PinInputGroup>
        <PinInputSlot v-for="index in 2" :key="index" :index="index - 1" />
      </PinInputGroup>
      <PinInputSeparator />
      <PinInputGroup>
        <PinInputSlot v-for="index in 2" :key="index + 2" :index="index + 1" />
      </PinInputGroup>
    </PinInput>
    <p class="text-xs text-muted-foreground" aria-live="polite">
      {{ completed ? `رمز کامل شد: ${completed}` : 'چهار رقم وارد کنید.' }}
    </p>
  </div>
</template>
