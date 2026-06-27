import { Badge } from '@/ember-ui/badge';
import { Spinner } from '@/ember-ui/spinner';

<template>
  <div class="flex flex-wrap gap-2">
    <Badge @variant="destructive">
      <Spinner data-icon="inline-start" />
      Deleting
    </Badge>
    <Badge @variant="secondary">
      Generating
      <Spinner data-icon="inline-end" />
    </Badge>
  </div>
</template>
