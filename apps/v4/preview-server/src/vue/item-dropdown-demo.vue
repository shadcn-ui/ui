<script setup lang="ts">
import { ChevronDownIcon } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
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
  <div class="flex min-h-64 w-full max-w-md flex-col items-center gap-6">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline" size="sm" class="w-fit">
          Select <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-72 [--radius:0.65rem]" align="end">
        <DropdownMenuItem v-for="person in people" :key="person.username" class="p-0">
          <Item size="sm" class="w-full p-2">
            <ItemMedia>
              <Avatar class="size-8">
                <AvatarImage :src="person.avatar" class="grayscale" />
                <AvatarFallback>{{ person.username.charAt(0) }}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent class="gap-0.5">
              <ItemTitle>{{ person.username }}</ItemTitle>
              <ItemDescription>{{ person.email }}</ItemDescription>
            </ItemContent>
          </Item>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
