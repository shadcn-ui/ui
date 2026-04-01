import { Button } from '@/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/ui/item';

import BadgeCheck from '~icons/lucide/badge-check';
import ChevronRight from '~icons/lucide/chevron-right';

<template>
  <div class="flex w-full max-w-md flex-col gap-6">
    <Item @variant="outline">
      <ItemContent>
        <ItemTitle>Two-factor authentication</ItemTitle>
        <ItemDescription @class="text-pretty xl:hidden 2xl:block">
          Verify via email or phone number.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button @size="sm">Enable</Button>
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
          <BadgeCheck class="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Your profile has been verified.</ItemTitle>
        </ItemContent>
        <ItemActions>
          <ChevronRight class="size-4" />
        </ItemActions>
      </a>
    </Item>
  </div>
</template>
