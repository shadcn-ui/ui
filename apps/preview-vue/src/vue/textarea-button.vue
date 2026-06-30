<script setup lang="ts">
import { Button } from '@/ui/button'
import { Textarea } from '@/ui/textarea'
</script>

<template>
  <div class="grid w-full gap-2">
    <Textarea placeholder="Type your message here." />
    <Button>Send message</Button>
  </div>
</template>
