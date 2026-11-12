<script setup lang="ts">
import { ref } from 'vue'
import { Check } from 'lucide-vue-next'
import { toPersianDigits } from '@saaze/utils'
import {
  Button,
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@saaze/ui'

const steps = [
  { step: 1, title: 'اطلاعات حساب', description: 'نام و ایمیل' },
  { step: 2, title: 'نشانی', description: 'محل تحویل سفارش' },
  { step: 3, title: 'پرداخت', description: 'تأیید و پرداخت' },
]
const current = ref(2)
</script>

<template>
  <div class="grid w-full max-w-2xl gap-6">
    <Stepper v-model="current" class="w-full items-start">
      <StepperItem
        v-for="item in steps"
        :key="item.step"
        v-slot="{ state }"
        :step="item.step"
        class="relative flex-1 flex-col"
      >
        <StepperSeparator
          v-if="item.step !== steps.length"
          class="absolute start-[calc(50%+1.5rem)] end-[calc(-50%+1.5rem)] top-5 block"
        />
        <StepperTrigger>
          <StepperIndicator>
            <Check v-if="state === 'completed'" class="size-4" aria-hidden="true" />
            <span v-else>{{ toPersianDigits(item.step) }}</span>
          </StepperIndicator>
          <StepperTitle>{{ item.title }}</StepperTitle>
          <StepperDescription class="hidden sm:block">{{ item.description }}</StepperDescription>
        </StepperTrigger>
      </StepperItem>
    </Stepper>

    <div class="flex justify-between gap-2">
      <Button variant="outline" :disabled="current <= 1" @click="current--">مرحله قبل</Button>
      <Button :disabled="current >= steps.length" @click="current++">مرحله بعد</Button>
    </div>
  </div>
</template>
