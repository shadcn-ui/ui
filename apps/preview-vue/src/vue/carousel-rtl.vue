<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent } from '@/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/ui/carousel'

const dir = ref<'ltr' | 'rtl'>('rtl')
</script>

<template>
  <Carousel
    :dir="dir"
    class="w-full max-w-xs"
    :opts="{
      direction: dir,
    }"
  >
    <CarouselContent>
      <CarouselItem v-for="(_, index) in 5" :key="index">
        <div class="p-1">
          <Card :dir="dir">
            <CardContent class="flex aspect-square items-center justify-center p-6">
              <span class="text-4xl font-semibold">{{ index + 1 }}</span>
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>
