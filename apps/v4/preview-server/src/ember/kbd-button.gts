import { Button } from '@/ember-ui/button';
import { Kbd } from '@/ember-ui/kbd';

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Button @class="pr-2" @size="sm" @variant="outline">
      Accept
      <Kbd>⏎</Kbd>
    </Button>
    <Button @class="pr-2" @size="sm" @variant="outline">
      Cancel
      <Kbd>Esc</Kbd>
    </Button>
  </div>
</template>
