<script setup lang="ts">
import { Button } from "@/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/ui/card"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="Footer with Border (Small)">
    <Card size="sm" class="mx-auto w-full max-w-sm">
      <CardContent>
        <p>
          The footer has a border-t class applied, creating a visual
          separation between the content and footer sections.
        </p>
      </CardContent>
      <CardFooter class="border-t">
        <Button variant="outline" size="sm" class="w-full">
          Footer with Border
        </Button>
      </CardFooter>
    </Card>
  </Example>
</template>
