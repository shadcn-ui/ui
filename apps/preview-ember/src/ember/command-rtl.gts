import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/ember-ui/command';

import Calculator from '~icons/ms/calculate';
import Calendar from '~icons/ms/calendar_month';
import CreditCard from '~icons/ms/credit_card';
import Settings from '~icons/ms/settings';
import Smile from '~icons/ms/mood';
import User from '~icons/ms/person';

<template>
  <Command @class="max-w-sm rounded-lg border" @dir="rtl">
    <CommandInput @placeholder="اكتب أمرًا أو ابحث..." @dir="rtl" />
    <CommandList>
      <CommandEmpty>لم يتم العثور على نتائج.</CommandEmpty>
      <CommandGroup @heading="اقتراحات">
        <CommandItem @value="calendar">
          <Calendar />
          <span>التقويم</span>
        </CommandItem>
        <CommandItem @value="emoji">
          <Smile />
          <span>البحث عن الرموز التعبيرية</span>
        </CommandItem>
        <CommandItem @disabled={{true}} @value="calculator">
          <Calculator />
          <span>الآلة الحاسبة</span>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup @heading="الإعدادات">
        <CommandItem @value="profile">
          <User />
          <span>الملف الشخصي</span>
          <CommandShortcut>⌘P</CommandShortcut>
        </CommandItem>
        <CommandItem @value="billing">
          <CreditCard />
          <span>الفوترة</span>
          <CommandShortcut>⌘B</CommandShortcut>
        </CommandItem>
        <CommandItem @value="settings">
          <Settings />
          <span>الإعدادات</span>
          <CommandShortcut>⌘S</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>
