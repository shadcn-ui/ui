<script setup lang="ts">
import { AudioLinesIcon, PlusIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import { Button } from '@/ui/button'
import { ButtonGroup } from '@/ui/button-group'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/ui/input-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip'

const voiceEnabled = ref(false)
</script>

<template>
  <ButtonGroup class="[--radius:9999rem]">
    <ButtonGroup>
      <Button variant="outline" size="icon" aria-label="Add">
        <PlusIcon />
      </Button>
    </ButtonGroup>
    <ButtonGroup class="flex-1">
      <InputGroup>
        <InputGroupInput
          :placeholder="voiceEnabled ? 'Record and send audio...' : 'Send a message...'"
          :disabled="voiceEnabled"
        />
        <InputGroupAddon align="inline-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <InputGroupButton
                  :data-active="voiceEnabled"
                  class="data-[active=true]:bg-orange-100 data-[active=true]:text-orange-700 dark:data-[active=true]:bg-orange-800 dark:data-[active=true]:text-orange-100"
                  :aria-pressed="voiceEnabled"
                  size="icon-xs"
                  aria-label="Voice Mode"
                  @click="() => voiceEnabled = !voiceEnabled"
                >
                  <AudioLinesIcon />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>Voice Mode</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </InputGroupAddon>
      </InputGroup>
    </ButtonGroup>
  </ButtonGroup>
</template>
