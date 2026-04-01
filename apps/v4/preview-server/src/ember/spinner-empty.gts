import { Button } from '@/ember-ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/ember-ui/empty';
import { Spinner } from '@/ember-ui/spinner';

<template>
  <Empty @class="w-full border md:p-6">
    <EmptyHeader>
      <EmptyMedia @variant="icon">
        <Spinner />
      </EmptyMedia>
      <EmptyTitle>Processing your request</EmptyTitle>
      <EmptyDescription>
        Please wait while we process your request. Do not refresh the page.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button @size="sm" @variant="outline">
        Cancel
      </Button>
    </EmptyContent>
  </Empty>
</template>
