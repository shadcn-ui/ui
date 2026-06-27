<script setup lang="ts">
import { ref } from 'vue'

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/ui/menubar'

const profile = ref('benoit')
</script>

<template>
  <Menubar dir="rtl">
    <MenubarMenu>
      <MenubarTrigger>ملف</MenubarTrigger>
      <MenubarContent>
        <MenubarGroup>
          <MenubarItem>
            علامة تبويب جديدة <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            نافذة جديدة <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>نافذة التصفح المتخفي الجديدة</MenubarItem>
        </MenubarGroup>
        <MenubarSeparator />
        <MenubarGroup>
          <MenubarSub>
            <MenubarSubTrigger>مشاركة</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarGroup>
                <MenubarItem>رابط البريد الإلكتروني</MenubarItem>
                <MenubarItem>الرسائل</MenubarItem>
                <MenubarItem>الملاحظات</MenubarItem>
              </MenubarGroup>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarGroup>
        <MenubarSeparator />
        <MenubarGroup>
          <MenubarItem>
            طباعة... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarGroup>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>تعديل</MenubarTrigger>
      <MenubarContent>
        <MenubarGroup>
          <MenubarItem>
            تراجع <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            إعادة <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
        </MenubarGroup>
        <MenubarSeparator />
        <MenubarGroup>
          <MenubarSub>
            <MenubarSubTrigger>بحث</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarGroup>
                <MenubarItem>البحث على الويب</MenubarItem>
              </MenubarGroup>
              <MenubarSeparator />
              <MenubarGroup>
                <MenubarItem>بحث...</MenubarItem>
                <MenubarItem>البحث التالي</MenubarItem>
                <MenubarItem>البحث السابق</MenubarItem>
              </MenubarGroup>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarGroup>
        <MenubarSeparator />
        <MenubarGroup>
          <MenubarItem>قص</MenubarItem>
          <MenubarItem>نسخ</MenubarItem>
          <MenubarItem>لصق</MenubarItem>
        </MenubarGroup>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>عرض</MenubarTrigger>
      <MenubarContent class="w-44">
        <MenubarGroup>
          <MenubarCheckboxItem>شريط الإشارات المرجعية</MenubarCheckboxItem>
          <MenubarCheckboxItem :model-value="true">عناوين URL الكاملة</MenubarCheckboxItem>
        </MenubarGroup>
        <MenubarSeparator />
        <MenubarGroup>
          <MenubarItem inset>
            إعادة تحميل <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            إعادة تحميل قسري <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
        </MenubarGroup>
        <MenubarSeparator />
        <MenubarGroup>
          <MenubarItem inset>تبديل وضع ملء الشاشة</MenubarItem>
        </MenubarGroup>
        <MenubarSeparator />
        <MenubarGroup>
          <MenubarItem inset>إخفاء الشريط الجانبي</MenubarItem>
        </MenubarGroup>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>الملفات الشخصية</MenubarTrigger>
      <MenubarContent>
        <MenubarRadioGroup :model-value="profile" @update:model-value="profile = $event as string">
          <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
          <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
          <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
        </MenubarRadioGroup>
        <MenubarSeparator />
        <MenubarGroup>
          <MenubarItem inset>تعديل...</MenubarItem>
        </MenubarGroup>
        <MenubarSeparator />
        <MenubarGroup>
          <MenubarItem inset>إضافة ملف شخصي...</MenubarItem>
        </MenubarGroup>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</template>
