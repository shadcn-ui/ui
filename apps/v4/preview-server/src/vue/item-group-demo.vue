<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { Button } from '@/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/ui/item'

const people = [
  {
    username: 'shadcn',
    avatar: 'https://github.com/shadcn.png',
    email: 'shadcn@vercel.com',
  },
  {
    username: 'maxleiter',
    avatar: 'https://github.com/maxleiter.png',
    email: 'maxleiter@vercel.com',
  },
  {
    username: 'evilrabbit',
    avatar: 'https://github.com/evilrabbit.png',
    email: 'evilrabbit@vercel.com',
  },
]
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-6">
    <ItemGroup>
      <template v-for="(person, index) in people" :key="person.username">
        <Item>
          <ItemMedia>
            <Avatar>
              <AvatarImage :src="person.avatar" class="grayscale" />
              <AvatarFallback>{{ person.username.charAt(0) }}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent class="gap-1">
            <ItemTitle>{{ person.username }}</ItemTitle>
            <ItemDescription>{{ person.email }}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="ghost" size="icon" class="rounded-full">
              <Plus />
            </Button>
          </ItemActions>
        </Item>
        <ItemSeparator v-if="index !== people.length - 1" />
      </template>
    </ItemGroup>
  </div>
</template>
