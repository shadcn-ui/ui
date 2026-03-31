<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="Header with Border (Small)">
    <Card size="sm" class="mx-auto w-full max-w-sm">
      <CardHeader class="border-b">
        <CardTitle>Header with Border</CardTitle>
        <CardDescription>
          This is a small card with a header that has a bottom border.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The header has a border-b class applied, creating a visual
          separation between the header and content sections.
        </p>
      </CardContent>
    </Card>
  </Example>
</template>
