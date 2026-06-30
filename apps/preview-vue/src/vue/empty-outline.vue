<script setup lang="ts">
import Cloud from "@material-symbols/svg-400/rounded/cloud.svg?component"
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
  <Empty class="border border-dashed">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Cloud />
      </EmptyMedia>
      <EmptyTitle>Cloud Storage Empty</EmptyTitle>
      <EmptyDescription>
        Upload files to your cloud storage to access them anywhere.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button variant="outline" size="sm">
        Upload Files
      </Button>
    </EmptyContent>
  </Empty>
</template>
