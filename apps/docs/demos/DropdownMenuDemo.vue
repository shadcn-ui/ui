<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@saaze/ui'
import {
  ChevronDown,
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  PlusCircle,
  Settings,
  User,
  Users,
} from 'lucide-vue-next'

const showBookmarks = ref(true)
const theme = ref('system')
</script>

<template>
  <div class="grid w-full place-items-center">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline">
          حساب کاربری
          <ChevronDown aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent class="w-60">
        <DropdownMenuLabel>حساب من</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User aria-hidden="true" />
            <span>پروفایل</span>
            <DropdownMenuShortcut>⇧P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard aria-hidden="true" />
            <span>صورت‌حساب</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings aria-hidden="true" />
            <span>تنظیمات</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Keyboard aria-hidden="true" />
            <span>کلیدهای میانبر</span>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Users aria-hidden="true" />
            <span>اعضای تیم</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <PlusCircle aria-hidden="true" />
              <span>دعوت کاربر</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent class="w-48">
              <DropdownMenuItem>ایمیل</DropdownMenuItem>
              <DropdownMenuItem>پیامک</DropdownMenuItem>
              <DropdownMenuItem>لینک اختصاصی</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <Github aria-hidden="true" />
            <span>مخزن گیت‌هاب</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeBuoy aria-hidden="true" />
            <span>پشتیبانی</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Cloud aria-hidden="true" />
            <span>فضای ابری (به‌زودی)</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuCheckboxItem v-model:checked="showBookmarks">
          نمایش نشانک‌ها
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>پوسته</DropdownMenuLabel>
        <DropdownMenuRadioGroup v-model="theme">
          <DropdownMenuRadioItem value="light">روشن</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">تاریک</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">هماهنگ با سیستم</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem class="text-destructive focus:text-destructive">
          <LogOut aria-hidden="true" />
          <span>خروج از حساب</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
