import { Button } from '@/ember-ui/button';

import ArrowUpRightIcon from '~icons/lucide/arrow-up-right';

<template>
  <div class="flex flex-col items-start gap-8 sm:flex-row">
    <div class="flex items-start gap-2">
      <Button @size="sm" @variant="outline">
        Small
      </Button>
      <Button @size="icon-sm" @variant="outline" aria-label="Submit">
        <ArrowUpRightIcon />
      </Button>
    </div>
    <div class="flex items-start gap-2">
      <Button @variant="outline">Default</Button>
      <Button @size="icon" @variant="outline" aria-label="Submit">
        <ArrowUpRightIcon />
      </Button>
    </div>
    <div class="flex items-start gap-2">
      <Button @size="lg" @variant="outline">
        Large
      </Button>
      <Button @size="icon-lg" @variant="outline" aria-label="Submit">
        <ArrowUpRightIcon />
      </Button>
    </div>
  </div>
</template>
