import { Button } from '@/ember-ui/button';
import { Input } from '@/ember-ui/input';

<template>
  <div class="flex w-full max-w-sm items-center gap-2">
    <Input placeholder="Email" type="email" />
    <Button @variant="outline" type="submit">Subscribe</Button>
  </div>
</template>
