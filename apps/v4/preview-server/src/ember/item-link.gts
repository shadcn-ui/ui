import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/ember-ui/item';

import ChevronRightIcon from '~icons/lucide/chevron-right';
import ExternalLinkIcon from '~icons/lucide/external-link';

<template>
  <div class="flex w-full max-w-md flex-col gap-4">
    <Item @asChild={{true}} as |item|>
      <a
        class={{item.class}}
        data-size={{item.size}}
        data-slot={{item.slot}}
        data-variant={{item.variant}}
        href="#"
      >
        <ItemContent>
          <ItemTitle>Visit our documentation</ItemTitle>
          <ItemDescription>
            Learn how to get started with our components.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon class="size-4" />
        </ItemActions>
      </a>
    </Item>
    <Item @asChild={{true}} @variant="outline" as |item|>
      <a
        class={{item.class}}
        data-size={{item.size}}
        data-slot={{item.slot}}
        data-variant={{item.variant}}
        href="#"
        rel="noopener noreferrer"
        target="_blank"
      >
        <ItemContent>
          <ItemTitle>External resource</ItemTitle>
          <ItemDescription>
            Opens in a new tab with security attributes.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <ExternalLinkIcon class="size-4" />
        </ItemActions>
      </a>
    </Item>
  </div>
</template>
