<script setup lang="ts">
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/ui/alert"
import { Example } from "@/components"
</script>

<template>
  <Example title="Basic">
    <div class="mx-auto flex w-full max-w-lg flex-col gap-4">
      <Alert>
        <AlertTitle>Success! Your changes have been saved.</AlertTitle>
      </Alert>
      <Alert>
        <AlertTitle>Success! Your changes have been saved.</AlertTitle>
        <AlertDescription>
          This is an alert with title and description.
        </AlertDescription>
      </Alert>
      <Alert>
        <AlertDescription>
          This one has a description only. No title. No icon.
        </AlertDescription>
      </Alert>
    </div>
  </Example>
</template>
