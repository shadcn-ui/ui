<script setup lang="ts">
import { Button } from '@/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from '@/ui/item'
import { Progress } from '@/ui/progress'
import { Spinner } from '@/ui/spinner'
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-4 [--radius:1rem]">
    <Item variant="outline">
      <ItemMedia variant="icon">
        <Spinner />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Downloading...</ItemTitle>
        <ItemDescription>129 MB / 1000 MB</ItemDescription>
      </ItemContent>
      <ItemActions class="hidden sm:flex">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
      </ItemActions>
      <ItemFooter>
        <Progress :model-value="75" />
      </ItemFooter>
    </Item>
  </div>
</template>
