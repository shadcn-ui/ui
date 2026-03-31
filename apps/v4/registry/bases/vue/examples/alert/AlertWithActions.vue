<script setup lang="ts">
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/ui/alert"
import { Badge } from "@/ui/badge"
import { Button } from "@/ui/button"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="With Actions">
    <div class="mx-auto flex w-full max-w-lg flex-col gap-4">
      <Alert>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
        <AlertTitle>The selected emails have been marked as spam.</AlertTitle>
        <AlertAction>
          <Button size="xs">
            Undo
          </Button>
        </AlertAction>
      </Alert>
      <Alert>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
        <AlertTitle>The selected emails have been marked as spam.</AlertTitle>
        <AlertDescription>
          This is a very long alert title that demonstrates how the component
          handles extended text content.
        </AlertDescription>
        <AlertAction>
          <Badge variant="secondary">
            Badge
          </Badge>
        </AlertAction>
      </Alert>
    </div>
  </Example>
</template>
