<script setup lang="ts">
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from '@/ui/avatar'
</script>

<template>
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
    <AvatarBadge class="bg-green-600 dark:bg-green-800" />
  </Avatar>
</template>
