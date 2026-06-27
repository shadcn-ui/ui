<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
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
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="default">
        <Avatar class="size-12">
          <AvatarImage
            src="https://github.com/zernonia.png"
            class="grayscale"
          />
          <AvatarFallback>ZN</AvatarFallback>
        </Avatar>
      </EmptyMedia>
      <EmptyTitle>User Offline</EmptyTitle>
      <EmptyDescription>
        This user is currently offline. You can leave a message to notify them
        or try again later.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button size="sm">
        Leave Message
      </Button>
    </EmptyContent>
  </Empty>
</template>
