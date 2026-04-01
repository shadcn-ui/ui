import { ToggleGroup, ToggleGroupItem } from '@/ui/toggle-group';

import Bookmark from '~icons/lucide/bookmark';
import Heart from '~icons/lucide/heart';
import Star from '~icons/lucide/star';

<template>
  <ToggleGroup @size="sm" @spacing={{2}} @type="multiple" @variant="outline">
    <ToggleGroupItem
      @class="data-[state=on]:bg-transparent data-[state=on]:[&_path]:fill-yellow-500 data-[state=on]:[&_path]:stroke-yellow-500"
      @value="star"
      aria-label="Toggle star"
    >
      <Star />
      Star
    </ToggleGroupItem>
    <ToggleGroupItem
      @class="data-[state=on]:bg-transparent data-[state=on]:[&_path]:fill-red-500 data-[state=on]:[&_path]:stroke-red-500"
      @value="heart"
      aria-label="Toggle heart"
    >
      <Heart />
      Heart
    </ToggleGroupItem>
    <ToggleGroupItem
      @class="data-[state=on]:bg-transparent data-[state=on]:[&_path]:fill-blue-500 data-[state=on]:[&_path]:stroke-blue-500"
      @value="bookmark"
      aria-label="Toggle bookmark"
    >
      <Bookmark />
      Bookmark
    </ToggleGroupItem>
  </ToggleGroup>
</template>
