import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';

<template>
  <div class="grid w-full gap-3">
    <Label @for="message-2">Your Message</Label>
    <Textarea id="message-2" placeholder="Type your message here." />
    <p class="text-muted-foreground text-sm">
      Your message will be copied to the support team.
    </p>
  </div>
</template>
