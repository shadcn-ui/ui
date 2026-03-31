<script setup lang="ts">
import { Card, CardContent } from "@/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/ui/carousel"
import { Example } from "@/components"
</script>

<template>
  <Example title="With Gap">
    <Carousel class="mx-auto max-w-xs sm:max-w-sm">
      <CarouselContent class="-ml-1">
        <CarouselItem v-for="index in 5" :key="index" class="pl-1 md:basis-1/2">
          <div class="p-1">
            <Card>
              <CardContent class="flex aspect-square items-center justify-center p-6">
                <span class="text-2xl font-semibold">{{ index }}</span>
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
