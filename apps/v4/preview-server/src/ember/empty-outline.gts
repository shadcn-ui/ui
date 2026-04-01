import { Button } from '@/ember-ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/ember-ui/empty';

import Cloud from '~icons/lucide/cloud';

<template>
  <Empty @class="border border-dashed">
    <EmptyHeader>
      <EmptyMedia @variant="icon">
        <Cloud />
      </EmptyMedia>
      <EmptyTitle>Cloud Storage Empty</EmptyTitle>
      <EmptyDescription>
        Upload files to your cloud storage to access them anywhere.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button @size="sm" @variant="outline">
        Upload Files
      </Button>
    </EmptyContent>
  </Empty>
</template>
