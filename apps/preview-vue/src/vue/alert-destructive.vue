<script setup lang="ts">
import AlertCircleIcon from "@material-symbols/svg-400/rounded/error.svg?component"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/ui/alert'
</script>

<template>
  <Alert variant="destructive">
    <AlertCircleIcon />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>
      Your session has expired. Please log in again.
    </AlertDescription>
  </Alert>
</template>
