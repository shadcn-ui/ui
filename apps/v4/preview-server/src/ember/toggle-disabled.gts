import { Toggle } from '@/ember-ui/toggle';

import Underline from '~icons/lucide/underline';

<template>
  <Toggle @disabled={{true}} aria-label="Toggle underline">
    <Underline />
  </Toggle>
</template>
