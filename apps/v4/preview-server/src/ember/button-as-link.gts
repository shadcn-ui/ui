import { LinkTo } from '@ember/routing';

import { Button } from '@/ember-ui/button';

<template>
  <Button @asChild={{true}} as |button|>
    <LinkTo @route="index" class={{button.classes}}>Login</LinkTo>
  </Button>
</template>
