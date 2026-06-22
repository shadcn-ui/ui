<script setup lang="ts">
import AlertCircleIcon from "@material-symbols/svg-400/rounded/error.svg?component"
import CheckCircle2Icon from "@material-symbols/svg-400/rounded/check_circle.svg?component"
import PopcornIcon from "@material-symbols/svg-400/rounded/theaters.svg?component"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/ui/alert'
</script>

<template>
  <div class="grid w-full max-w-xl items-start gap-4">
    <Alert>
      <CheckCircle2Icon />
      <AlertTitle>Success! Your changes have been saved</AlertTitle>
      <AlertDescription>
        This is an alert with icon, title and description.
      </AlertDescription>
    </Alert>

    <Alert>
      <PopcornIcon />
      <AlertTitle>This Alert has a title and an icon. No description.</AlertTitle>
    </Alert>

    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Unable to process your payment.</AlertTitle>
      <AlertDescription>
        <p>Please verify your billing information and try again.</p>
        <ul class="mt-2 list-inside list-disc space-y-1">
          <li>Check your card details</li>
          <li>Ensure sufficient funds</li>
          <li>Verify billing address</li>
        </ul>
      </AlertDescription>
    </Alert>
  </div>
</template>
