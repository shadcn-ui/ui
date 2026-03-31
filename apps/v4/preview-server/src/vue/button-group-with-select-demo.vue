<script setup lang="ts">
import { ArrowRightIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import { Button } from '@/ui/button'
import { ButtonGroup } from '@/ui/button-group'
import { Input } from '@/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/ui/select'

const CURRENCIES = [
  {
    value: '$',
    label: 'US Dollar',
  },
  {
    value: '€',
    label: 'Euro',
  },
  {
    value: '£',
    label: 'British Pound',
  },
]
const currency = ref('$')
</script>

<template>
  <ButtonGroup>
    <ButtonGroup>
      <Select v-model="currency">
        <SelectTrigger class="font-mono w-14">
          {{ currency }}
        </SelectTrigger>
        <SelectContent class="min-w-24">
          <SelectItem v-for="item in CURRENCIES" :key="item.value" :value="item.value">
            {{ item.value }}
            <span class="text-muted-foreground">{{ item.label }}</span>
          </SelectItem>
        </SelectContent>
      </Select>
      <Input placeholder="10.00" pattern="[0-9]*" />
    </ButtonGroup>
    <ButtonGroup>
      <Button aria-label="Send" size="icon" variant="outline">
        <ArrowRightIcon />
      </Button>
    </ButtonGroup>
  </ButtonGroup>
</template>
