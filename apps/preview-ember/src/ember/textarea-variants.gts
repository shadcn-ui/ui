import { Textarea } from '@/ember-ui/textarea';

<template>
  <div class="flex w-full flex-col gap-4">
    <Textarea @variant="outline" placeholder="Outline" />
    <Textarea @variant="filled" placeholder="Filled" />
    <Textarea @variant="underline" placeholder="Underline" />
    <Textarea @variant="ghost" placeholder="Ghost" />
  </div>
</template>
