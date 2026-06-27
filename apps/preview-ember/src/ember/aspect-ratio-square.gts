import { AspectRatio } from '@/ember-ui/aspect-ratio';

const ratio = 1 / 1;

<template>
  <div class="w-full max-w-[12rem]">
    <AspectRatio @ratio={{ratio}} class="bg-muted rounded-lg overflow-hidden">
      <img
        alt="Decorative by Drew Beamer"
        class="h-full w-full rounded-lg object-cover"
        src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
      />
    </AspectRatio>
  </div>
</template>
