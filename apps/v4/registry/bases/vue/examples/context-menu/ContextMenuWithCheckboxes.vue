<script setup lang="ts">
import { ref } from "vue"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuTrigger,
} from "@/ui/context-menu"
import { Example } from "@/components/example"

const showBookmarksBar = ref(true)
const showFullUrls = ref(false)
const showDeveloperTools = ref(false)
</script>

<template>
  <Example title="With Checkboxes">
    <ContextMenu>
      <ContextMenuTrigger class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuCheckboxItem
            :checked="showBookmarksBar"
            @update:checked="showBookmarksBar = $event"
          >
            Show Bookmarks Bar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            :checked="showFullUrls"
            @update:checked="showFullUrls = $event"
          >
            Show Full URLs
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            :checked="showDeveloperTools"
            @update:checked="showDeveloperTools = $event"
          >
            Show Developer Tools
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  </Example>
</template>
