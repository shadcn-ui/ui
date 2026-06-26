<script setup lang="ts">
import CheckCircle2Icon from "@material-symbols/svg-400/rounded/check_circle.svg?component"
import InfoIcon from "@material-symbols/svg-400/rounded/info.svg?component"
import TriangleAlertIcon from "@material-symbols/svg-400/rounded/warning.svg?component"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/ui/alert'
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-4">
    <Alert variant="success">
      <CheckCircle2Icon />
      <AlertTitle>Payment received</AlertTitle>
      <AlertDescription>Your invoice has been paid in full.</AlertDescription>
    </Alert>
    <Alert variant="info">
      <InfoIcon />
      <AlertTitle>Scheduled maintenance</AlertTitle>
      <AlertDescription>The service will be unavailable on Sunday from 02:00–04:00 UTC.</AlertDescription>
    </Alert>
    <Alert variant="warning">
      <TriangleAlertIcon />
      <AlertTitle>Your subscription expires soon</AlertTitle>
      <AlertDescription>Renew within 3 days to avoid any interruption to your service.</AlertDescription>
    </Alert>
  </div>
</template>
