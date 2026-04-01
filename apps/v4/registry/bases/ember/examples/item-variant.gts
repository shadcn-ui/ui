import { Button } from '@/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/ui/item';

<template>
  <div class="flex flex-col gap-6">
    <Item>
      <ItemContent>
        <ItemTitle>Default Variant</ItemTitle>
        <ItemDescription>
          Standard styling with subtle background and borders.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button @size="sm" @variant="outline">
          Open
        </Button>
      </ItemActions>
    </Item>
    <Item @variant="outline">
      <ItemContent>
        <ItemTitle>Outline Variant</ItemTitle>
        <ItemDescription>
          Outlined style with clear borders and transparent background.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button @size="sm" @variant="outline">
          Open
        </Button>
      </ItemActions>
    </Item>
    <Item @variant="muted">
      <ItemContent>
        <ItemTitle>Muted Variant</ItemTitle>
        <ItemDescription>
          Subdued appearance with muted colors for secondary content.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button @size="sm" @variant="outline">
          Open
        </Button>
      </ItemActions>
    </Item>
  </div>
</template>
