<script setup lang="ts">
import { ScrollArea, ScrollBar } from "@/ui/scroll-area"

const works = [
  {
    artist: "Ornella Binni",
    art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Tom Byrom",
    art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Vladimir Malyav",
    art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
  },
]
</script>

<template>
  <ScrollArea class="mx-auto w-full max-w-96 rounded-md border p-4">
    <div class="flex gap-4">
      <figure v-for="artwork in works" :key="artwork.artist" class="shrink-0">
        <div class="overflow-hidden rounded-md">
          <img
            :src="artwork.art"
            :alt="`Photo by ${artwork.artist}`"
            class="aspect-[3/4] h-fit w-fit object-cover"
            width="300"
            height="400"
          >
        </div>
        <figcaption class="text-muted-foreground pt-2 text-xs">
          Photo by
          <span class="text-foreground font-semibold">
            {{ artwork.artist }}
          </span>
        </figcaption>
      </figure>
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
</template>
