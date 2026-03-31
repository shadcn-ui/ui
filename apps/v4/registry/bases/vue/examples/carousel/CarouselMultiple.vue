<script setup lang="ts">
import { Card, CardContent } from "@/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/ui/carousel"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="Multiple">
    <Carousel
      class="mx-auto max-w-xs sm:max-w-sm"
      :opts="{
        align: 'start',
      }"
    >
      <CarouselContent>
        <CarouselItem v-for="index in 5" :key="index" class="sm:basis-1/2 lg:basis-1/3">
          <div class="p-1">
            <Card>
              <CardContent class="flex aspect-square items-center justify-center p-6">
                <span class="text-3xl font-semibold">{{ index }}</span>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious class="hidden sm:inline-flex" />
      <CarouselNext class="hidden sm:inline-flex" />
    </Carousel>
  </Example>
</template>
