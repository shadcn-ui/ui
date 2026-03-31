<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { ToggleGroup, ToggleGroupItem } from "@/ui/toggle-group"
</script>

<template>
  <ToggleGroup type="multiple" variant="outline" :spacing="1" size="sm">
    <ToggleGroupItem
      value="star"
      aria-label="Toggle star"
      class="aria-pressed:*:[svg]:fill-foreground aria-pressed:*:[svg]:stroke-foreground aria-pressed:bg-transparent"
    >
      <IconPlaceholder
        lucide="StarIcon"
        tabler="IconStar"
        hugeicons="StarIcon"
        phosphor="StarIcon"
        remixicon="RiStarLine"
      />
      Star
    </ToggleGroupItem>
    <ToggleGroupItem
      value="heart"
      aria-label="Toggle heart"
      class="aria-pressed:*:[svg]:fill-foreground aria-pressed:*:[svg]:stroke-foreground aria-pressed:bg-transparent"
    >
      <IconPlaceholder
        lucide="HeartIcon"
        tabler="IconHeart"
        hugeicons="FavouriteIcon"
        phosphor="HeartIcon"
        remixicon="RiHeartLine"
      />
      Heart
    </ToggleGroupItem>
    <ToggleGroupItem
      value="bookmark"
      aria-label="Toggle bookmark"
      class="aria-pressed:*:[svg]:fill-foreground aria-pressed:*:[svg]:stroke-foreground aria-pressed:bg-transparent"
    >
      <IconPlaceholder
        lucide="BookmarkIcon"
        tabler="IconBookmark"
        hugeicons="BookmarkIcon"
        phosphor="BookmarkSimpleIcon"
        remixicon="RiBookmarkLine"
      />
      Bookmark
    </ToggleGroupItem>
  </ToggleGroup>
</template>
