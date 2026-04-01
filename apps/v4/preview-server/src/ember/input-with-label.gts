import { Input } from '@/ember-ui/input';
import { Label } from '@/ember-ui/label';

<template>
  <div class="grid w-full max-w-sm items-center gap-3">
    <Label for="email">Email</Label>
    <Input id="email" placeholder="Email" type="email" />
  </div>
</template>
