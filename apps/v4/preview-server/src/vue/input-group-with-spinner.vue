<script setup lang="ts">
import { LoaderIcon } from 'lucide-vue-next'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/ui/input-group'
import { Spinner } from '@/ui/spinner'
</script>

<template>
  <div class="grid w-full max-w-sm gap-4">
    <InputGroup data-disabled>
      <InputGroupInput placeholder="Searching..." disabled />
      <InputGroupAddon align="inline-end">
        <Spinner />
      </InputGroupAddon>
    </InputGroup>
    <InputGroup data-disabled>
      <InputGroupInput placeholder="Processing..." disabled />
      <InputGroupAddon>
        <Spinner />
      </InputGroupAddon>
    </InputGroup>
    <InputGroup data-disabled>
      <InputGroupInput placeholder="Saving changes..." disabled />
      <InputGroupAddon align="inline-end">
        <InputGroupText>Saving...</InputGroupText>
        <Spinner />
      </InputGroupAddon>
    </InputGroup>
    <InputGroup data-disabled>
      <InputGroupInput placeholder="Refreshing data..." disabled />
      <InputGroupAddon>
        <LoaderIcon class="animate-spin" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupText class="text-muted-foreground">
          Please wait...
        </InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  </div>
</template>
