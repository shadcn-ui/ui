<script setup lang="ts">
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/card'
</script>

<template>
  <Card class="relative mx-auto w-full max-w-sm pt-0">
    <div class="absolute inset-0 z-30 aspect-video bg-black/35" />
    <img
      src="https://avatar.vercel.sh/shadcn1"
      alt="Event cover"
      class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
    />
    <CardHeader>
      <CardAction>
        <Badge variant="secondary">Featured</Badge>
      </CardAction>
      <CardTitle>Design systems meetup</CardTitle>
      <CardDescription>
        A practical talk on component APIs, accessibility, and shipping
        faster.
      </CardDescription>
    </CardHeader>
    <CardFooter>
      <Button class="w-full">View Event</Button>
    </CardFooter>
  </Card>
</template>
