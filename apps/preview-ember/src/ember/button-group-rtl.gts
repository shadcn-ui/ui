import { Button } from '@/ember-ui/button';
import { ButtonGroup } from '@/ember-ui/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ember-ui/dropdown-menu';

import ArchiveIcon from '~icons/ms/archive';
import ArrowLeftIcon from '~icons/ms/arrow_left';
import MoreHorizontalIcon from '~icons/ms/more_horiz';

<template>
  <div dir="rtl">
    <ButtonGroup>
      <ButtonGroup class="hidden sm:flex">
        <Button @size="icon" @variant="outline" aria-label="رجوع">
          <ArrowLeftIcon class="rtl:rotate-180" />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button @size="sm" @variant="outline">أرشفة</Button>
        <Button @size="sm" @variant="outline">تقرير</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button @size="sm" @variant="outline">تأجيل</Button>
        <DropdownMenu>
          <DropdownMenuTrigger @asChild={{true}} as |trigger|>
            <Button
              @size="icon-sm"
              @variant="outline"
              aria-label="خيارات إضافية"
              {{trigger.modifiers}}
            >
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent @class="w-40">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ArchiveIcon />
                أرشفة
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem @variant="destructive">
                حذف
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  </div>
</template>
