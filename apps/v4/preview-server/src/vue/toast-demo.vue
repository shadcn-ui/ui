<!-- eslint-disable no-console -->
<!-- eslint-disable no-template-curly-in-string -->
<script setup lang="ts">
import { toast } from 'vue-sonner'

import { Button } from '@/ui/button'
</script>

<template>
  <Button
    variant="outline"
    @click="() =>
      toast('Event has been created', {
        description: 'Sunday, December 03, 2023 at 9:00 AM',
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      })
    "
  >
    Show Toast
  </Button>
</template>
