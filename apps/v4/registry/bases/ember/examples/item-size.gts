import { Button } from '@/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/ui/item';

import BadgeCheckIcon from '~icons/lucide/badge-check';
import ChevronRightIcon from '~icons/lucide/chevron-right';

<template>
  <div class="flex w-full max-w-md flex-col gap-6">
    <Item @variant="outline">
      <ItemContent>
        <ItemTitle>Basic Item</ItemTitle>
        <ItemDescription>
          A simple item with title and description.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button @size="sm" @variant="outline">
          Action
        </Button>
      </ItemActions>
    </Item>
    <Item @asChild={{true}} @size="sm" @variant="outline" as |item|>
      <a
        class={{item.class}}
        data-size={{item.size}}
        data-slot={{item.slot}}
        data-variant={{item.variant}}
        href="#"
      >
        <ItemMedia>
          <BadgeCheckIcon class="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Your profile has been verified.</ItemTitle>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon class="size-4" />
        </ItemActions>
      </a>
    </Item>
  </div>
</template>
