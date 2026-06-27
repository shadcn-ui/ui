import { Button } from '@/ember-ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/ember-ui/popover';

const physicalSides = ['left', 'top', 'bottom', 'right'] as const;

const labels: Record<string, string> = {
  left: 'يسار',
  top: 'أعلى',
  bottom: 'أسفل',
  right: 'يمين',
};

<template>
  <div class="flex flex-wrap justify-center gap-2" dir="rtl">
    {{#each physicalSides as |side|}}
      <Popover>
        <PopoverTrigger>
          <Button @variant="outline">{{labels.[side]}}</Button>
        </PopoverTrigger>
        <PopoverContent @side={{side}} dir="rtl">
          <div class="flex flex-col gap-1">
            <p class="text-sm font-medium">الأبعاد</p>
            <p class="text-muted-foreground text-sm">تعيين الأبعاد للطبقة.</p>
          </div>
        </PopoverContent>
      </Popover>
    {{/each}}
  </div>
</template>
