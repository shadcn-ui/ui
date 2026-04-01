import { Badge } from '@/ember-ui/badge';
import { Spinner } from '@/ember-ui/spinner';

<template>
  <div class="flex items-center gap-2">
    <Badge>
      <Spinner />
      Syncing
    </Badge>
    <Badge @variant="secondary">
      <Spinner />
      Updating
    </Badge>
    <Badge @variant="outline">
      <Spinner />
      Loading
    </Badge>
  </div>
</template>
