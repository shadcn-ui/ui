import { Button } from '@/ember-ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ember-ui/tooltip';

<template>
  <Tooltip>
    <TooltipTrigger>
      <span class="inline-block w-fit">
        <Button @variant="outline" disabled>Disabled</Button>
      </span>
    </TooltipTrigger>
    <TooltipContent>
      <p>This feature is currently unavailable</p>
    </TooltipContent>
  </Tooltip>
</template>
