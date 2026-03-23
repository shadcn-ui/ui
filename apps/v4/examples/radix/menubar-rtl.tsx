"use client"

import * as React from "react"
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
} from "@/examples/radix/ui-rtl/menubar"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      file: "File",
      newTab: "New Tab",
      newWindow: "New Window",
      newIncognitoWindow: "New Incognito Window",
      share: "Share",
      emailLink: "Email link",
      messages: "Messages",
      notes: "Notes",
      print: "Print...",
      edit: "Edit",
      undo: "Undo",
      redo: "Redo",
      find: "Find",
      searchTheWeb: "Search the web",
      findItem: "Find...",
      findNext: "Find Next",
      findPrevious: "Find Previous",
      cut: "Cut",
      copy: "Copy",
      paste: "Paste",
      view: "View",
      bookmarksBar: "Bookmarks Bar",
      fullUrls: "Full URLs",
      reload: "Reload",
      forceReload: "Force Reload",
      toggleFullscreen: "Toggle Fullscreen",
      hideSidebar: "Hide Sidebar",
      profiles: "Profiles",
      andy: "Andy",
      benoit: "Benoit",
      luis: "Luis",
      editProfile: "Edit...",
      addProfile: "Add Profile...",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      file: "ملف",
      newTab: "علامة تبويب جديدة",
      newWindow: "نافذة جديدة",
      newIncognitoWindow: "نافذة التصفح المتخفي الجديدة",
      share: "مشاركة",
      emailLink: "رابط البريد الإلكتروني",
      messages: "الرسائل",
      notes: "الملاحظات",
      print: "طباعة...",
      edit: "تعديل",
      undo: "تراجع",
      redo: "إعادة",
      find: "بحث",
      searchTheWeb: "البحث على الويب",
      findItem: "بحث...",
      findNext: "البحث التالي",
      findPrevious: "البحث السابق",
      cut: "قص",
      copy: "نسخ",
      paste: "لصق",
      view: "عرض",
      bookmarksBar: "شريط الإشارات المرجعية",
      fullUrls: "عناوين URL الكاملة",
      reload: "إعادة تحميل",
      forceReload: "إعادة تحميل قسري",
      toggleFullscreen: "تبديل وضع ملء الشاشة",
      hideSidebar: "إخفاء الشريط الجانبي",
      profiles: "الملفات الشخصية",
      andy: "Andy",
      benoit: "Benoit",
      luis: "Luis",
      editProfile: "تعديل...",
      addProfile: "إضافة ملف شخصي...",
    },
  },
  he: {
    dir: "rtl",
    values: {
      file: "קובץ",
      newTab: "כרטיסייה חדשה",
      newWindow: "חלון חדש",
      newIncognitoWindow: "חלון גלישה בסתר חדש",
      share: "שתף",
      emailLink: "קישור אימייל",
      messages: "הודעות",
      notes: "הערות",
      print: "הדפס...",
      edit: "ערוך",
      undo: "בטל",
      redo: "בצע שוב",
      find: "מצא",
      searchTheWeb: "חפש באינטרנט",
      findItem: "מצא...",
      findNext: "מצא הבא",
      findPrevious: "מצא הקודם",
      cut: "גזור",
      copy: "העתק",
      paste: "הדבק",
      view: "תצוגה",
      bookmarksBar: "סרגל סימניות",
      fullUrls: "כתובות URL מלאות",
      reload: "רענן",
      forceReload: "רענן בכוח",
      toggleFullscreen: "החלף מסך מלא",
      hideSidebar: "הסתר סרגל צד",
      profiles: "פרופילים",
      andy: "Andy",
      benoit: "Benoit",
      luis: "Luis",
      editProfile: "ערוך...",
      addProfile: "הוסף פרופיל...",
    },
  },
}

export function MenubarRtl() {
  const { dir, t, language } = useTranslation(translations, "ar")
  const [profile, setProfile] = React.useState("benoit")

  return (
    <Menubar className="w-72" dir={dir}>
      <MenubarMenu>
        <MenubarTrigger>{t.file}</MenubarTrigger>
        <MenubarContent data-lang={dir === "rtl" ? language : undefined}>
          <MenubarGroup>
            <MenubarItem>
              {t.newTab} <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              {t.newWindow} <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>{t.newIncognitoWindow}</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarSub>
              <MenubarSubTrigger>{t.share}</MenubarSubTrigger>
              <MenubarSubContent
                data-lang={dir === "rtl" ? language : undefined}
              >
                <MenubarGroup>
                  <MenubarItem>{t.emailLink}</MenubarItem>
                  <MenubarItem>{t.messages}</MenubarItem>
                  <MenubarItem>{t.notes}</MenubarItem>
                </MenubarGroup>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem>
              {t.print} <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>{t.edit}</MenubarTrigger>
        <MenubarContent data-lang={dir === "rtl" ? language : undefined}>
          <MenubarGroup>
            <MenubarItem>
              {t.undo} <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              {t.redo} <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarSub>
              <MenubarSubTrigger>{t.find}</MenubarSubTrigger>
              <MenubarSubContent
                data-lang={dir === "rtl" ? language : undefined}
              >
                <MenubarGroup>
                  <MenubarItem>{t.searchTheWeb}</MenubarItem>
                </MenubarGroup>
                <MenubarSeparator />
                <MenubarGroup>
                  <MenubarItem>{t.findItem}</MenubarItem>
                  <MenubarItem>{t.findNext}</MenubarItem>
                  <MenubarItem>{t.findPrevious}</MenubarItem>
                </MenubarGroup>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem>{t.cut}</MenubarItem>
            <MenubarItem>{t.copy}</MenubarItem>
            <MenubarItem>{t.paste}</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>{t.view}</MenubarTrigger>
        <MenubarContent
          className="w-44"
          data-lang={dir === "rtl" ? language : undefined}
        >
          <MenubarGroup>
            <MenubarCheckboxItem>{t.bookmarksBar}</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>{t.fullUrls}</MenubarCheckboxItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>
              {t.reload} <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled inset>
              {t.forceReload} <MenubarShortcut>⇧⌘R</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>{t.toggleFullscreen}</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>{t.hideSidebar}</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>{t.profiles}</MenubarTrigger>
        <MenubarContent data-lang={dir === "rtl" ? language : undefined}>
          <MenubarRadioGroup value={profile} onValueChange={setProfile}>
            <MenubarRadioItem value="andy">{t.andy}</MenubarRadioItem>
            <MenubarRadioItem value="benoit">{t.benoit}</MenubarRadioItem>
            <MenubarRadioItem value="Luis">{t.luis}</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>{t.editProfile}</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>{t.addProfile}</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
