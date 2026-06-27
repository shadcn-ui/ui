<script setup lang="ts">
import { ref } from 'vue'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/ui/context-menu'

const user = ref('pedro')
const theme = ref('light')
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
      Right click here
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuGroup>
        <ContextMenuLabel>People</ContextMenuLabel>
        <ContextMenuRadioGroup v-model="user">
          <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuLabel>Theme</ContextMenuLabel>
        <ContextMenuRadioGroup v-model="theme">
          <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
          <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
          <ContextMenuRadioItem value="system">System</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
</template>
