<script setup lang="ts">
import { BotIcon, ChevronDownIcon } from 'lucide-vue-next'
import { Button } from '@/ui/button'
import { ButtonGroup } from '@/ui/button-group'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/popover'
import { Separator } from '@/ui/separator'
import { Textarea } from '@/ui/textarea'
</script>

<template>
  <ButtonGroup>
    <Button variant="outline">
      <BotIcon /> Copilot
    </Button>
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="outline" size="icon" aria-label="Open Popover">
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" class="p-0 text-sm rounded-xl">
        <div class="px-4 py-3">
          <div class="text-sm font-medium">
            Agent Tasks
          </div>
        </div>
        <Separator />
        <div class="p-4 text-sm *:[p:not(:last-child)]:mb-2">
          <Textarea
            placeholder="Describe your task in natural language."
            class="mb-4 resize-none"
          />
          <p class="font-medium">
            Start a new task with Copilot
          </p>
          <p class="text-muted-foreground">
            Describe your task in natural language. Copilot will work in the
            background and open a pull request for your review.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  </ButtonGroup>
</template>
