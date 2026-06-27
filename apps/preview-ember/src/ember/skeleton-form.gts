import { Skeleton } from '@/ember-ui/skeleton';

<template>
  <div class="flex w-full max-w-xs flex-col gap-7">
    <div class="flex flex-col gap-3">
      <Skeleton @class="h-4 w-20" />
      <Skeleton @class="h-8 w-full" />
    </div>
    <div class="flex flex-col gap-3">
      <Skeleton @class="h-4 w-24" />
      <Skeleton @class="h-8 w-full" />
    </div>
    <Skeleton @class="h-8 w-24" />
  </div>
</template>
