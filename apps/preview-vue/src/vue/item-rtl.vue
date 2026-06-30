<script setup lang="ts">
import BadgeCheckIcon from "@material-symbols/svg-400/rounded/verified.svg?component"
import ChevronRightIcon from "@material-symbols/svg-400/rounded/chevron_right.svg?component"
import { Button } from '@/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/ui/item'
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-6" dir="rtl">
    <Item variant="outline" dir="rtl">
      <ItemContent>
        <ItemTitle>عنصر أساسي</ItemTitle>
        <ItemDescription>
          عنصر بسيط يحتوي على عنوان ووصف.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">
          إجراء
        </Button>
      </ItemActions>
    </Item>
    <Item variant="outline" size="sm" as-child dir="rtl">
      <a href="#">
        <ItemMedia>
          <BadgeCheckIcon class="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>تم التحقق من ملفك الشخصي.</ItemTitle>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon class="size-4" />
        </ItemActions>
      </a>
    </Item>
  </div>
</template>
