import { Button } from '@/ember-ui/button';
import { Spinner } from '@/ember-ui/spinner';

<template>
  <Button @disabled={{true}} @size="sm" @variant="outline">
    <Spinner />
    Submit
  </Button>
</template>
