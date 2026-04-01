import { Input } from '@/ui/input';
import { Label } from '@/ui/label';

<template>
  <div class="grid w-full max-w-sm items-center gap-3">
    <Label for="email">Email</Label>
    <Input id="email" placeholder="Email" type="email" />
  </div>
</template>
