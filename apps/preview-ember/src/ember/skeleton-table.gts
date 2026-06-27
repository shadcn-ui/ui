import { array } from '@ember/helper';
import { Skeleton } from '@/ember-ui/skeleton';

<template>
  <div class="flex w-full max-w-sm flex-col gap-2">
    {{#each (array 0 1 2 3 4) as |index|}}
      <div class="flex gap-4">
        <Skeleton @class="h-4 flex-1" />
        <Skeleton @class="h-4 w-24" />
        <Skeleton @class="h-4 w-20" />
      </div>
    {{/each}}
  </div>
</template>
