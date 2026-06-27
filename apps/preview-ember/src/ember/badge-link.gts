import { Badge } from '@/ember-ui/badge';
import ArrowUpRightIcon from '~icons/ms/north_east';

<template>
  <Badge @asChild={{true}} as |badge|>
    <a href="#link" class={{badge.classes}}>
      Open Link <ArrowUpRightIcon data-icon="inline-end" />
    </a>
  </Badge>
</template>
