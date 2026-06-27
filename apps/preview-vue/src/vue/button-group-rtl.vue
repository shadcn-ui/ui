<script setup lang="ts">
import ArchiveIcon from "@material-symbols/svg-400/rounded/archive.svg?component"
import ArrowLeftIcon from "@material-symbols/svg-400/rounded/arrow_left.svg?component"
import MoreHorizontalIcon from "@material-symbols/svg-400/rounded/more_horiz.svg?component"
import { Button } from '@/ui/button'
import { ButtonGroup } from '@/ui/button-group'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/ui/dropdown-menu'
</script>

<template>
  <div dir="rtl">
    <ButtonGroup>
      <ButtonGroup class="hidden sm:flex">
        <Button variant="outline" size="icon" aria-label="رجوع">
          <ArrowLeftIcon class="rtl:rotate-180" />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">أرشفة</Button>
        <Button variant="outline">تقرير</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">تأجيل</Button>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="icon" aria-label="خيارات إضافية">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-40">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ArchiveIcon />
                أرشفة
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                حذف
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  </div>
</template>
