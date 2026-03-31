<script setup lang="ts">
import { Bell, RefreshCcw } from 'lucide-vue-next'
import { Button } from '@/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/ui/empty'
</script>

<template>
  <Empty class="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Bell />
      </EmptyMedia>
      <EmptyTitle>No Notifications</EmptyTitle>
      <EmptyDescription>
        You're all caught up. New notifications will appear here.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button variant="outline" size="sm">
        <RefreshCcw />
        Refresh
      </Button>
    </EmptyContent>
  </Empty>
</template>
