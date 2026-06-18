import { Badge } from '@/ember-ui/badge';

<template>
  <div class="flex flex-wrap gap-2">
    <Badge @variant="success-solid">Success</Badge>
    <Badge @variant="warning-solid">Warning</Badge>
    <Badge @variant="info-solid">Info</Badge>
    <Badge @variant="error-solid">Error</Badge>
  </div>
</template>
