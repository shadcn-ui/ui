<script setup lang="ts">
import { ref } from 'vue'

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuTrigger,
} from '@/ui/context-menu'

const showBookmarksBar = ref(true)
const showFullUrls = ref(false)
const showDeveloperTools = ref(true)
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
      Right click here
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuGroup>
        <ContextMenuCheckboxItem v-model="showBookmarksBar">
          Show Bookmarks Bar
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem v-model="showFullUrls">
          Show Full URLs
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem v-model="showDeveloperTools">
          Show Developer Tools
        </ContextMenuCheckboxItem>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
</template>
