<script setup lang="ts">
import { Card, CardContent } from '@/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/ui/carousel'
</script>

<template>
  <Carousel
    orientation="vertical"
    class="relative w-full max-w-xs"
    :opts="{
      align: 'start',
    }"
  >
    <CarouselContent class="-mt-1 h-[200px]">
      <CarouselItem v-for="(_, index) in 5" :key="index" class="p-1 md:basis-1/2">
        <div class="p-1">
          <Card>
            <CardContent class="flex items-center justify-center p-6">
              <span class="text-3xl font-semibold">{{ index + 1 }}</span>
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>
