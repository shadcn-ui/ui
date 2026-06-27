<script setup lang="ts">
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/ui/item'

const music = [
  {
    title: 'Midnight City Lights',
    artist: 'Neon Dreams',
    album: 'Electric Nights',
    duration: '3:45',
  },
  {
    title: 'Coffee Shop Conversations',
    artist: 'The Morning Brew',
    album: 'Urban Stories',
    duration: '4:05',
  },
  {
    title: 'Digital Rain',
    artist: 'Cyber Symphony',
    album: 'Binary Beats',
    duration: '3:30',
  },
]
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-6">
    <ItemGroup class="gap-4">
      <Item
        v-for="song in music"
        :key="song.title"
        variant="outline"
        as-child
        role="listitem"
      >
        <a href="#">
          <ItemMedia variant="image">
            <img
              :src="`https://avatar.vercel.sh/${song.title}`"
              :alt="song.title"
              width="32"
              height="32"
              class="object-cover grayscale"
            >
          </ItemMedia>
          <ItemContent>
            <ItemTitle class="line-clamp-1">
              {{ song.title }} - <span class="text-muted-foreground">{{ song.album }}</span>
            </ItemTitle>
            <ItemDescription>{{ song.artist }}</ItemDescription>
          </ItemContent>
          <ItemContent class="flex-none text-center">
            <ItemDescription>{{ song.duration }}</ItemDescription>
          </ItemContent>
        </a>
      </Item>
    </ItemGroup>
  </div>
</template>
