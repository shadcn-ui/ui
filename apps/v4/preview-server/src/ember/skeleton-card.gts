import { Skeleton } from '@/ember-ui/skeleton';

<template>
  <div class="flex flex-col space-y-3">
    <Skeleton @class="h-[125px] w-[250px] rounded-xl" />
    <div class="space-y-2">
      <Skeleton @class="h-4 w-[250px]" />
      <Skeleton @class="h-4 w-[200px]" />
    </div>
  </div>
</template>
