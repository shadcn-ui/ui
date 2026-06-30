import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/ember-ui/select';

<template>
  <Select>
    <SelectTrigger @class="w-32" dir="rtl">
      <SelectValue @placeholder="اختر فاكهة" />
    </SelectTrigger>
    <SelectContent dir="rtl">
      <SelectGroup>
        <SelectLabel>الفواكه</SelectLabel>
        <SelectItem @value="apple">تفاح</SelectItem>
        <SelectItem @value="banana">موز</SelectItem>
        <SelectItem @value="blueberry">توت أزرق</SelectItem>
        <SelectItem @value="grapes">عنب</SelectItem>
        <SelectItem @value="pineapple">أناناس</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel>الخضروات</SelectLabel>
        <SelectItem @value="carrot">جزر</SelectItem>
        <SelectItem @value="broccoli">بروكلي</SelectItem>
        <SelectItem @value="spinach">سبانخ</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
