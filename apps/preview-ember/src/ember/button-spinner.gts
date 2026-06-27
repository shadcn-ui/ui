import { Button } from '@/ember-ui/button';
import { Spinner } from '@/ember-ui/spinner';

<template>
  <div class="flex gap-2">
    <Button @disabled={{true}} @variant="outline">
      <Spinner data-icon="inline-start" />
      Generating
    </Button>
    <Button @disabled={{true}} @variant="secondary">
      Downloading
      <Spinner data-icon="inline-start" />
    </Button>
  </div>
</template>
