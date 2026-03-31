<script setup lang="ts">
import { ref } from "vue"
import { Example } from "@/components"
import { Button } from "@/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/ui/command"

const open = ref(false)
</script>

<template>
  <Example title="Basic">
    <div class="flex flex-col gap-4">
      <Button
        variant="outline"
        class="w-fit"
        @click="open = true"
      >
        Open Menu
      </Button>
      <CommandDialog v-model:open="open">
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem value="calendar">
                Calendar
              </CommandItem>
              <CommandItem value="search-emoji">
                Search Emoji
              </CommandItem>
              <CommandItem value="calculator">
                Calculator
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  </Example>
</template>
