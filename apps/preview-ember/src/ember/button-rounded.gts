import { Button } from '@/ember-ui/button';

import ArrowUpRightIcon from '~icons/ms/north_east';

<template>
  <div class="flex flex-col gap-8">
    <Button @class="rounded-full" @size="icon" @variant="outline">
      <ArrowUpRightIcon />
    </Button>
  </div>
</template>
