<script setup lang="ts">
import ArrowUpRightIcon from "@material-symbols/svg-400/rounded/north_east.svg?component"
import FolderCode from "@material-symbols/svg-400/rounded/folder_code.svg?component"
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
  <Empty dir="rtl">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <FolderCode />
      </EmptyMedia>
      <EmptyTitle>لا توجد مشاريع بعد</EmptyTitle>
      <EmptyDescription>
        لم تقم بإنشاء أي مشاريع بعد. ابدأ بإنشاء مشروعك الأول.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent class="flex-row justify-center gap-2">
      <Button>إنشاء مشروع</Button>
      <Button variant="outline">استيراد مشروع</Button>
    </EmptyContent>
    <Button variant="link" as-child class="text-muted-foreground" size="sm">
      <a href="#">
        تعرف على المزيد <ArrowUpRightIcon class="rtl:rotate-[270deg]" />
      </a>
    </Button>
  </Empty>
</template>
