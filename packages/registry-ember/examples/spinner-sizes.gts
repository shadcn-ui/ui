import { Spinner } from '@/ui/spinner';

<template>
  <div class="flex items-center gap-6">
    <Spinner @size="xs" />
    <Spinner @size="sm" />
    <Spinner @size="md" />
    <Spinner @size="lg" />
  </div>
</template>
