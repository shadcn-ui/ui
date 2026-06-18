import { Kbd } from '@/ui/kbd';

<template>
  <div class="flex items-center gap-4">
    <Kbd>⌘K</Kbd>
    <div class="rounded-md bg-primary px-3 py-1.5">
      <Kbd @variant="primary">⌘K</Kbd>
    </div>
  </div>
</template>
