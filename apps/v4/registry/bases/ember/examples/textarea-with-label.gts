import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';

<template>
  <div class="grid w-full gap-3">
    <Label @for="message">Your message</Label>
    <Textarea id="message" placeholder="Type your message here." />
  </div>
</template>
