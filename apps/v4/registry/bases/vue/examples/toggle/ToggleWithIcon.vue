<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Toggle } from "@/ui/toggle"
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Toggle aria-label="Toggle bookmark" :default-pressed="true">
      <IconPlaceholder
        lucide="BookmarkIcon"
        tabler="IconBookmark"
        hugeicons="BookmarkIcon"
        phosphor="BookmarkSimpleIcon"
        remixicon="RiBookmarkLine"
        class="group-data-[state=on]/toggle:fill-accent-foreground"
      />
    </Toggle>
    <Toggle variant="outline" aria-label="Toggle bookmark outline">
      <IconPlaceholder
        lucide="BookmarkIcon"
        tabler="IconBookmark"
        hugeicons="BookmarkIcon"
        phosphor="BookmarkSimpleIcon"
        remixicon="RiBookmarkLine"
        class="group-data-[state=on]/toggle:fill-accent-foreground"
      />
      Bookmark
    </Toggle>
  </div>
</template>
