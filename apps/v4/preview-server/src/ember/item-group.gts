import { lt } from 'ember-truth-helpers';

import { Avatar, AvatarFallback, AvatarImage } from '@/ember-ui/avatar';
import { Button } from '@/ember-ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/ember-ui/item';

import PlusIcon from '~icons/lucide/plus';

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
  <div class="flex w-full max-w-md flex-col gap-6">
    <ItemGroup>
      {{#each people as |person index|}}
        <Item>
          <ItemMedia>
            <Avatar>
              <AvatarImage @class="grayscale" @src={{person.avatar}} />
              <AvatarFallback>{{person.username}}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent @class="gap-1">
            <ItemTitle>{{person.username}}</ItemTitle>
            <ItemDescription>{{person.email}}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button @class="rounded-full" @size="icon" @variant="ghost">
              <PlusIcon />
            </Button>
          </ItemActions>
        </Item>
        {{#if (lt index 2)}}
          <ItemSeparator />
        {{/if}}
      {{/each}}
    </ItemGroup>
  </div>
</template>
