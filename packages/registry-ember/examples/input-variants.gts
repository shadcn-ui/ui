import { Input } from '@/ui/input';

<template>
  <div class="flex w-full flex-col gap-4">
    <Input @variant="outline" placeholder="Outline" />
    <Input @variant="filled" placeholder="Filled" />
    <Input @variant="underline" placeholder="Underline" />
    <Input @variant="ghost" placeholder="Ghost" />
  </div>
</template>
