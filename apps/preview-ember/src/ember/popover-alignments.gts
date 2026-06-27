import { Button } from '@/ember-ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/ember-ui/popover';

<template>
  <div class="flex gap-6">
    <Popover>
      <PopoverTrigger>
        <Button @variant="outline" @size="sm">Start</Button>
      </PopoverTrigger>
      <PopoverContent @align="start" @class="w-40">
        Aligned to start
      </PopoverContent>
    </Popover>
    <Popover>
      <PopoverTrigger>
        <Button @variant="outline" @size="sm">Center</Button>
      </PopoverTrigger>
      <PopoverContent @align="center" @class="w-40">
        Aligned to center
      </PopoverContent>
    </Popover>
    <Popover>
      <PopoverTrigger>
        <Button @variant="outline" @size="sm">End</Button>
      </PopoverTrigger>
      <PopoverContent @align="end" @class="w-40">
        Aligned to end
      </PopoverContent>
    </Popover>
  </div>
</template>
