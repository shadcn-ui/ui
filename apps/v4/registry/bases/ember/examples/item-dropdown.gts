import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/ui/item';

import ChevronDownIcon from '~icons/lucide/chevron-down';

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
];

<template>
  <div class="flex min-h-64 w-full max-w-md flex-col items-center gap-6">
    <DropdownMenu>
      <DropdownMenuTrigger @asChild={{true}} as |trigger|>
        <Button
          @class="w-fit"
          @size="sm"
          @variant="outline"
          {{trigger.modifiers}}
        >
          Select
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent @class="w-72 [--radius:0.65rem]">
        {{#each people as |person|}}
          <DropdownMenuItem @class="p-0">
            <Item @class="w-full p-2" @size="sm">
              <ItemMedia>
                <Avatar @class="size-8">
                  <AvatarImage @class="grayscale" @src={{person.avatar}} />
                  <AvatarFallback>{{person.username}}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent @class="gap-0.5">
                <ItemTitle>{{person.username}}</ItemTitle>
                <ItemDescription>{{person.email}}</ItemDescription>
              </ItemContent>
            </Item>
          </DropdownMenuItem>
        {{/each}}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
