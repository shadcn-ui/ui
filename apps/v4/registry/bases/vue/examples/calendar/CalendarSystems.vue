<script setup lang="ts">
import type { CalendarIdentifier, DateValue } from '@internationalized/date'
import { createCalendar, getLocalTimeZone, toCalendar, today } from '@internationalized/date'
import { Calendar } from '@/ui/calendar'
import { Label } from '@/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/ui/select'

const date = ref(today(getLocalTimeZone())) as Ref<DateValue>

const preferences = [
  { locale: 'en-US', label: 'Default', ordering: 'gregory' },
  { label: 'Arabic (Algeria)', locale: 'ar-DZ', territories: 'DJ DZ EH ER IQ JO KM LB LY MA MR OM PS SD SY TD TN YE', ordering: 'gregory islamic islamic-civil islamic-tbla' },
  { label: 'Arabic (United Arab Emirates)', locale: 'ar-AE', territories: 'AE BH KW QA', ordering: 'gregory islamic-umalqura islamic islamic-civil islamic-tbla' },
  { label: 'Arabic (Egypt)', locale: 'AR-EG', territories: 'EG', ordering: 'gregory coptic islamic islamic-civil islamic-tbla' },
  { label: 'Arabic (Saudi Arabia)', locale: 'ar-SA', territories: 'SA', ordering: 'islamic-umalqura gregory islamic islamic-rgsa' },
  { label: 'Farsi (Iran)', locale: 'fa-IR', territories: 'IR', ordering: 'persian gregory islamic islamic-civil islamic-tbla' },
  { label: 'Farsi (Afghanistan)', locale: 'fa-AF', territories: 'AF IR', ordering: 'persian gregory islamic islamic-civil islamic-tbla' },
  { label: 'Amharic (Ethiopia)', locale: 'am-ET', territories: 'ET', ordering: 'gregory ethiopic ethioaa' },
  { label: 'Hebrew (Israel)', locale: 'he-IL', territories: 'IL', ordering: 'gregory hebrew islamic islamic-civil islamic-tbla' },
  { label: 'Hindi (India)', locale: 'hi-IN', territories: 'IN', ordering: 'gregory indian' },
  { label: 'Japanese (Japan)', locale: 'ja-JP', territories: 'JP', ordering: 'gregory japanese' },
  { label: 'Thai (Thailand)', locale: 'th-TH', territories: 'TH', ordering: 'buddhist gregory' },
  { label: 'Chinese (Taiwan)', locale: 'zh-TW', territories: 'TW', ordering: 'gregory roc chinese' },
]

const calendars = [
  { key: 'gregory', name: 'Gregorian' },
  { key: 'japanese', name: 'Japanese' },
  { key: 'buddhist', name: 'Buddhist' },
  { key: 'roc', name: 'Taiwan' },
  { key: 'persian', name: 'Persian' },
  { key: 'indian', name: 'Indian' },
  { key: 'islamic-umalqura', name: 'Islamic (Umm al-Qura)' },
  { key: 'islamic-civil', name: 'Islamic Civil' },
  { key: 'islamic-tbla', name: 'Islamic Tabular' },
  { key: 'hebrew', name: 'Hebrew' },
  { key: 'coptic', name: 'Coptic' },
  { key: 'ethiopic', name: 'Ethiopic' },
  { key: 'ethioaa', name: 'Ethiopic (Amete Alem)' },
]

const locale = ref(preferences[0]?.locale)
const calendar = ref(calendars[0]?.key) as Ref<CalendarIdentifier>

const pref = computed(() => preferences.find(p => p.locale === locale.value))
const preferredCalendars = computed(() => pref.value ? pref.value.ordering.split(' ').map(p => calendars.find(c => c.key === p)).filter(Boolean) : [calendars[0]])
const otherCalendars = computed(() => calendars.filter(c => !preferredCalendars.value.some(p => p!.key === c.key)))

function updateLocale(newLocale: any) {
  locale.value = newLocale
  calendar.value = pref.value!.ordering.split(' ')[0] as any
}

const placeholder = computed(() => toCalendar(today(getLocalTimeZone()), createCalendar(calendar.value)))
</script>

<template>
  <div class="flex flex-col gap-4">
    <Label>Locale</Label>
    <Select
      :model-value="locale"
      @update:model-value="updateLocale"
    >
      <SelectTrigger class="w-full">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="(option, index) in preferences"
          :key="index"
          class="text-xs leading-none text-grass11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
          :value="option.locale"
        >
          {{ option.label }}
        </SelectItem>
      </SelectContent>
    </Select>

    <Label>Calendar</Label>
    <Select v-model="calendar" class="w-full">
      <SelectTrigger class="w-full">
        <SelectValue placeholder="Select a calendar">
          {{ calendars.find(c => c.key === calendar)?.name }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectLabel />
        <SelectGroup>
          <SelectItem
            v-for="(option, index) in preferredCalendars"
            :key="index"
            class="text-xs leading-none text-grass11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
            :value="option!.key"
          >
            {{ option!.name }}
          </SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectLabel>Other</SelectLabel>
        <SelectGroup>
          <SelectItem
            v-for="(option, index) in otherCalendars"
            :key="index"
            class="text-xs leading-none text-grass11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
            :value="option.key"
          >
            {{ option.name }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <Calendar
      v-model="date"
      v-model:placeholder="placeholder"
      :locale="locale"
      class="rounded-md border shadow-sm"
    />
  </div>
</template>
