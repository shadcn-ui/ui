import { Button } from '@/ember-ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/ember-ui/empty';

import ArrowUpRight from '~icons/ms/north_east';
import FolderCode from '~icons/ms/folder_code';

<template>
  <Empty dir="rtl">
    <EmptyHeader>
      <EmptyMedia @variant="icon">
        <FolderCode />
      </EmptyMedia>
      <EmptyTitle>لا توجد مشاريع بعد</EmptyTitle>
      <EmptyDescription>
        لم تقم بإنشاء أي مشاريع بعد. ابدأ بإنشاء مشروعك الأول.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent @class="flex-row justify-center gap-2">
      <Button>إنشاء مشروع</Button>
      <Button @variant="outline">استيراد مشروع</Button>
    </EmptyContent>
    <Button
      @asChild={{true}}
      @class="text-muted-foreground"
      @size="sm"
      @variant="link"
      as |button|
    >
      <a class={{button.classes}} href="#">
        تعرف على المزيد
        <ArrowUpRight class="rtl:rotate-[270deg]" />
      </a>
    </Button>
  </Empty>
</template>
