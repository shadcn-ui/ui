<script setup lang="ts">
import { toast } from 'vue-sonner'

import { Button } from '@/ui/button'
</script>

<template>
  <Button
    variant="outline"
    class="w-fit"
    @click="() =>
      toast('Event has been created', {
        description: 'Monday, January 3rd at 6:00pm',
      })
    "
  >
    Show Toast
  </Button>
</template>
