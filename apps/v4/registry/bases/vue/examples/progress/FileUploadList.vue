<script setup lang="ts">
import { computed } from "vue"
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Example } from "@/components/example"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/ui/item"
import { Progress } from "@/ui/progress"

const files = computed(() => [
  {
    id: "1",
    name: "document.pdf",
    progress: 45,
    timeRemaining: "2m 30s",
  },
  {
    id: "2",
    name: "presentation.pptx",
    progress: 78,
    timeRemaining: "45s",
  },
  {
    id: "3",
    name: "spreadsheet.xlsx",
    progress: 12,
    timeRemaining: "5m 12s",
  },
  {
    id: "4",
    name: "image.jpg",
    progress: 100,
    timeRemaining: "Complete",
  },
])
</script>

<template>
  <Example title="File Upload List">
    <ItemGroup>
      <Item
        v-for="file in files"
        :key="file.id"
        size="xs"
        class="px-0"
      >
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="FileIcon"
            tabler="IconFile"
            hugeicons="FileIcon"
            phosphor="FileIcon"
            remixicon="RiFileLine"
            class="size-5"
          />
        </ItemMedia>
        <ItemContent class="inline-block truncate">
          <ItemTitle class="inline">
            {{ file.name }}
          </ItemTitle>
        </ItemContent>
        <ItemContent>
          <Progress :value="file.progress" class="w-32" />
        </ItemContent>
        <ItemActions class="w-16 justify-end">
          <span class="text-sm text-muted-foreground">
            {{ file.timeRemaining }}
          </span>
        </ItemActions>
      </Item>
    </ItemGroup>
  </Example>
</template>
