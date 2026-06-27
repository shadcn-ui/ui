import { Button } from '@/ember-ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/ember-ui/popover';

<template>
  <Popover>
    <PopoverTrigger>
      <Button @variant="outline">Open Popover</Button>
    </PopoverTrigger>
    <PopoverContent @align="start">
      <div class="flex flex-col gap-1">
        <p class="text-sm font-medium">Dimensions</p>
        <p class="text-muted-foreground text-sm">
          Set the dimensions for the layer.
        </p>
      </div>
    </PopoverContent>
  </Popover>
</template>
