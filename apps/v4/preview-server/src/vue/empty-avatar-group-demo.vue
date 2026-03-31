<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/ui/avatar'
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
        <div class="*:ring-background flex -space-x-2 *:size-12 *:ring-2 *:grayscale">
          <Avatar>
            <AvatarImage
              src="https://github.com/ace-of-aces.png"
              alt="@ace-of-aces"
            />
            <AvatarFallback>AA</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://github.com/sadeghbarati.png"
              alt="@sadeghbarati"
            />
            <AvatarFallback>SB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://github.com/zernonia.png"
              alt="@zernonia"
            />
            <AvatarFallback>ZN</AvatarFallback>
          </Avatar>
        </div>
      </EmptyMedia>
      <EmptyTitle>No Team Members</EmptyTitle>
      <EmptyDescription>
        Invite your team to collaborate on this project.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button size="sm">
        <Plus />
        Invite Members
      </Button>
    </EmptyContent>
  </Empty>
</template>
