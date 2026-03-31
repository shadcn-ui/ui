<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { CheckIcon, CopyIcon, InfoIcon, StarIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/ui/input-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'

const isFavorite = ref(false)
const source = ref('hello')
const { text, copy, copied, isSupported } = useClipboard({ source })
</script>

<template>
  <div class="grid w-full max-w-sm gap-6">
    <InputGroup>
      <InputGroupInput placeholder="https://x.com/shadcn" read-only />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          aria-label="Copy"
          title="Copy"
          size="icon-xs"
          @click="copy('https://x.com/shadcn')"
        >
          <CheckIcon v-if="!copied" />
          <CopyIcon v-if="copied" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
    <InputGroup class="[--radius:9999px]">
      <Popover>
        <PopoverTrigger as-child>
          <InputGroupAddon>
            <InputGroupButton variant="secondary" size="icon-xs">
              <InfoIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          class="flex flex-col gap-1 text-sm rounded-xl"
        >
          <p class="font-medium">
            Your connection is not secure.
          </p>
          <p>You should not enter any sensitive information on this site.</p>
        </PopoverContent>
      </Popover>
      <InputGroupAddon class="text-muted-foreground pl-1.5">
        https://
      </InputGroupAddon>
      <InputGroupInput id="input-secure-19" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          @click="isFavorite = !isFavorite"
        >
          <StarIcon
            data-favorite="{isFavorite}"
            class="data-[favorite=true]:fill-blue-600 data-[favorite=true]:stroke-blue-600"
          />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupInput placeholder="Type to search..." />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="secondary">
          Search
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </div>
</template>
