<script setup lang="ts">
import ChevronRightIcon from "@material-symbols/svg-400/rounded/chevron_right.svg?component"
import ExternalLinkIcon from "@material-symbols/svg-400/rounded/open_in_new.svg?component"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/ui/item'
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-4">
    <Item as-child>
      <a href="#">
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
    <Item variant="outline" as-child>
      <a href="#" target="_blank" rel="noopener noreferrer">
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
