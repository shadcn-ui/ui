import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/ember-ui/item';

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
];

<template>
  <div class="flex w-full max-w-md flex-col gap-6">
    <ItemGroup @class="gap-4">
      {{#each music as |song|}}
        <Item @asChild={{true}} @variant="outline" as |item|>
          <a
            class={{item.class}}
            data-size={{item.size}}
            data-slot={{item.slot}}
            data-variant={{item.variant}}
            href="#"
          >
            <ItemMedia @variant="image">
              <img
                alt={{song.title}}
                class="object-cover grayscale"
                height="32"
                src="https://avatar.vercel.sh/{{song.title}}"
                width="32"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle @class="line-clamp-1">
                {{song.title}}
                -
                <span class="text-muted-foreground">{{song.album}}</span>
              </ItemTitle>
              <ItemDescription>{{song.artist}}</ItemDescription>
            </ItemContent>
            <ItemContent @class="flex-none text-center">
              <ItemDescription>{{song.duration}}</ItemDescription>
            </ItemContent>
          </a>
        </Item>
      {{/each}}
    </ItemGroup>
  </div>
</template>
