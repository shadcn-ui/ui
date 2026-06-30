import { Button } from '@/ember-ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/ember-ui/item';

import BadgeCheck from '~icons/ms/verified';
import ChevronRight from '~icons/ms/chevron_right';

<template>
  <div class="flex w-full max-w-md flex-col gap-6" dir="rtl">
    <Item @variant="outline" dir="rtl">
      <ItemContent>
        <ItemTitle>عنصر أساسي</ItemTitle>
        <ItemDescription>
          عنصر بسيط يحتوي على عنوان ووصف.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button @variant="outline" @size="sm">
          إجراء
        </Button>
      </ItemActions>
    </Item>
    <Item @asChild={{true}} @size="sm" @variant="outline" dir="rtl" as |item|>
      <a
        class={{item.class}}
        data-size={{item.size}}
        data-slot={{item.slot}}
        data-variant={{item.variant}}
        href="#"
      >
        <ItemMedia>
          <BadgeCheck class="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>تم التحقق من ملفك الشخصي.</ItemTitle>
        </ItemContent>
        <ItemActions>
          <ChevronRight class="size-4" />
        </ItemActions>
      </a>
    </Item>
  </div>
</template>
