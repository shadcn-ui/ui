<script setup lang="ts">
import CheckCircle2Icon from "@material-symbols/svg-400/rounded/check_circle.svg?component"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/ui/alert'
</script>

<template>
  <Alert class="max-w-md">
    <CheckCircle2Icon />
    <AlertTitle>Account updated successfully</AlertTitle>
    <AlertDescription>
      Your profile information has been saved. Changes will be reflected
      immediately.
    </AlertDescription>
  </Alert>
</template>
