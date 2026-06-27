<script setup lang="ts">
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/ui/alert'
import { Button } from '@/ui/button'
</script>

<template>
  <Alert class="max-w-md">
    <AlertTitle>Dark mode is now available</AlertTitle>
    <AlertDescription>
      Enable it under your profile settings to get started.
    </AlertDescription>
    <AlertAction>
      <Button size="xs" variant="default">Enable</Button>
    </AlertAction>
  </Alert>
</template>
