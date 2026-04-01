import { Button } from '@/ui/button';

import ArrowUpIcon from '~icons/lucide/arrow-up';

<template>
  <div class="flex flex-wrap items-center gap-2 md:flex-row">
    <Button @variant="outline">Button</Button>
    <Button @size="icon" @variant="outline" aria-label="Submit">
      <ArrowUpIcon />
    </Button>
  </div>
</template>
