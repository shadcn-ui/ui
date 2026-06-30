import { Button } from '@/ember-ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ember-ui/tooltip';

const sides = ['left', 'top', 'bottom', 'right'] as const;

const labels: Record<typeof sides[number], string> = {
  left: 'يسار',
  top: 'أعلى',
  bottom: 'أسفل',
  right: 'يمين',
};

<template>
  <div class="flex flex-wrap gap-2" dir="rtl">
    {{#each sides as |side|}}
      <Tooltip>
        <TooltipTrigger>
          <Button @variant="outline" @class="w-fit capitalize">{{labels.[side]}}</Button>
        </TooltipTrigger>
        <TooltipContent @side={{side}}>
          إضافة إلى المكتبة
        </TooltipContent>
      </Tooltip>
    {{/each}}
  </div>
</template>
