import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/ember-ui/item';

import InboxIcon from '~icons/ms/inbox';

<template>
  <div class="flex w-full max-w-md flex-col gap-6">
    <Item @variant="outline">
      <ItemMedia @variant="icon">
        <InboxIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Default Size</ItemTitle>
        <ItemDescription>
          The standard size for most use cases.
        </ItemDescription>
      </ItemContent>
    </Item>
    <Item @size="sm" @variant="outline">
      <ItemMedia @variant="icon">
        <InboxIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Small Size</ItemTitle>
        <ItemDescription>A compact size for dense layouts.</ItemDescription>
      </ItemContent>
    </Item>
    <Item @size="xs" @variant="outline">
      <ItemMedia @variant="icon">
        <InboxIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Extra Small Size</ItemTitle>
        <ItemDescription>The most compact size available.</ItemDescription>
      </ItemContent>
    </Item>
  </div>
</template>
