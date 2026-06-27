<script setup lang="ts">
import { ref } from 'vue'
import CreditCard from "@material-symbols/svg-400/rounded/credit_card.svg?component"
import Settings from "@material-symbols/svg-400/rounded/settings.svg?component"
import User from "@material-symbols/svg-400/rounded/person.svg?component"
import { Button } from '@/ui/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
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
          <CommandGroup heading="Settings">
            <CommandItem value="profile">
              <User />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem value="billing">
              <CreditCard />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem value="settings">
              <Settings />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  </div>
</template>
