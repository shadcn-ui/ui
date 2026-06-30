<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/ui/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ui/command'

const open = ref(false)
</script>

<template>
  <div class="flex flex-col gap-4">
    <Button @click="open = true" variant="outline" class="w-fit">
      Open Menu
    </Button>
    <CommandDialog :open="open" @update:open="open = $event">
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem value="calendar">Calendar</CommandItem>
            <CommandItem value="emoji">Search Emoji</CommandItem>
            <CommandItem value="calculator">Calculator</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  </div>
</template>
