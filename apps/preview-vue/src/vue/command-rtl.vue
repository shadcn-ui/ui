<script setup lang="ts">
import { ref } from 'vue'
import Calculator from "@material-symbols/svg-400/rounded/calculate.svg?component"
import Calendar from "@material-symbols/svg-400/rounded/calendar_month.svg?component"
import CreditCard from "@material-symbols/svg-400/rounded/credit_card.svg?component"
import Settings from "@material-symbols/svg-400/rounded/settings.svg?component"
import Smile from "@material-symbols/svg-400/rounded/mood.svg?component"
import User from "@material-symbols/svg-400/rounded/person.svg?component"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/ui/command'
</script>

<template>
  <Command class="max-w-sm rounded-lg border" dir="rtl">
    <CommandInput placeholder="اكتب أمرًا أو ابحث..." dir="rtl" />
    <CommandList>
      <CommandEmpty>لم يتم العثور على نتائج.</CommandEmpty>
      <CommandGroup heading="اقتراحات">
        <CommandItem value="calendar">
          <Calendar />
          <span>التقويم</span>
        </CommandItem>
        <CommandItem value="emoji">
          <Smile />
          <span>البحث عن الرموز التعبيرية</span>
        </CommandItem>
        <CommandItem :disabled="true" value="calculator">
          <Calculator />
          <span>الآلة الحاسبة</span>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="الإعدادات">
        <CommandItem value="profile">
          <User />
          <span>الملف الشخصي</span>
          <CommandShortcut>⌘P</CommandShortcut>
        </CommandItem>
        <CommandItem value="billing">
          <CreditCard />
          <span>الفوترة</span>
          <CommandShortcut>⌘B</CommandShortcut>
        </CommandItem>
        <CommandItem value="settings">
          <Settings />
          <span>الإعدادات</span>
          <CommandShortcut>⌘S</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>
