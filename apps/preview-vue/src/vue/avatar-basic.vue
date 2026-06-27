<script setup lang="ts">
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/ui/avatar'
</script>

<template>
  <Avatar>
    <AvatarImage
      src="https://github.com/shadcn.png"
      alt="@shadcn"
      class="grayscale"
    />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
</template>
