import { Input } from '@/ember-ui/input';
import { Label } from '@/ember-ui/label';

<template>
  <div class="grid w-full max-w-sm items-center gap-3">
    <Label for="picture">Picture</Label>
    <Input id="picture" type="file" />
  </div>
</template>
