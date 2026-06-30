<script setup lang="ts">
import BadgeCheckIcon from "@material-symbols/svg-400/rounded/verified.svg?component"
import BookmarkIcon from "@material-symbols/svg-400/rounded/bookmark.svg?component"
import { Badge } from '@/ui/badge'
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Badge variant="secondary">
      <BadgeCheckIcon data-icon="inline-start" />
      Verified
    </Badge>
    <Badge variant="outline">
      Bookmark
      <BookmarkIcon data-icon="inline-end" />
    </Badge>
  </div>
</template>
