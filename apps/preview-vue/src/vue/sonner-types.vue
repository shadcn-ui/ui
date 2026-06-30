<!-- eslint-disable no-console -->
<!-- eslint-disable no-template-curly-in-string -->
<script setup lang="ts">
import { toast } from 'vue-sonner'

import { Button } from '@/ui/button'

function handlePromiseClick() {
  toast.promise<{ name: string }>(
    () =>
      new Promise(resolve =>
        setTimeout(() => resolve({ name: 'Event' }), 2000),
      ),
    {
      loading: 'Loading...',
      success: (data: { name: string }) => `${data.name} has been created`,
      error: 'Error',
    },
  )
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Button variant="outline" @click="() => toast('Event has been created')">
      Default
    </Button>
    <Button
      variant="outline"
      @click="() => toast.success('Event has been created')"
    >
      Success
    </Button>
    <Button
      variant="outline"
      @click="() =>
        toast.info('Be at the area 10 minutes before the event time')
      "
    >
      Info
    </Button>
    <Button
      variant="outline"
      @click="() =>
        toast.warning('Event start time cannot be earlier than 8am')
      "
    >
      Warning
    </Button>
    <Button
      variant="outline"
      @click="() => toast.error('Event has not been created')"
    >
      Error
    </Button>
    <Button
      variant="outline"
      @click="handlePromiseClick"
    >
      Promise
    </Button>
  </div>
</template>
