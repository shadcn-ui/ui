<script setup lang="ts">
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
</script>

<template>
  <div class="flex w-full max-w-sm items-center space-x-2">
    <Input type="email" placeholder="Email" />
    <Button type="submit">
      Subscribe
    </Button>
  </div>
</template>
