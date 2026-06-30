import { Button } from '@/ember-ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ember-ui/tooltip';

const sides = ['left', 'top', 'bottom', 'right'] as const;

<template>
  <div class="flex flex-wrap gap-2">
    {{#each sides as |side|}}
      <Tooltip>
        <TooltipTrigger>
          <Button @variant="outline" @class="w-fit capitalize">{{side}}</Button>
        </TooltipTrigger>
        <TooltipContent @side={{side}}>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    {{/each}}
  </div>
</template>
