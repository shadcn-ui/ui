import { Button } from '@/ui/button';
import { Spinner } from '@/ui/spinner';

<template>
  <Button @disabled={{true}} @size="sm" @variant="outline">
    <Spinner />
    Submit
  </Button>
</template>
