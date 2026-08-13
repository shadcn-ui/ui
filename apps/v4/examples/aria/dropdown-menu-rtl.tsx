"use client"

import * as React from "react"
import { CreditCardIcon, SettingsIcon, UserIcon } from "lucide-react"
import type { Selection } from "react-aria-components"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"
import { Button } from "@/styles/aria-nova/ui-rtl/button"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/styles/aria-nova/ui-rtl/dropdown-menu"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      open: "Open",
      account: "Account",
      profile: "Profile",
      billing: "Billing",
      settings: "Settings",
      logout: "Log out",
      team: "Team",
      inviteUsers: "Invite users",
      email: "Email",
      message: "Message",
      more: "More",
      calendar: "Calendar",
      chat: "Chat",
      webhook: "Webhook",
      advanced: "Advanced...",
      newTeam: "New Team",
      view: "View",
      statusBar: "Status Bar",
      activityBar: "Activity Bar",
      panel: "Panel",
      position: "Position",
      top: "Top",
      bottom: "Bottom",
      right: "Right",
      left: "Left",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      open: "افتح القائمة",
      account: "الحساب",
      profile: "الملف الشخصي",
      billing: "الفوترة",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      team: "الفريق",
      inviteUsers: "دعوة المستخدمين",
      email: "البريد الإلكتروني",
      message: "رسالة",
      more: "المزيد",
      calendar: "تقويم",
      chat: "دردشة",
      webhook: "خطاف ويب",
      advanced: "متقدم...",
      newTeam: "فريق جديد",
      view: "عرض",
      statusBar: "شريط الحالة",
      activityBar: "شريط النشاط",
      panel: "اللوحة",
      position: "الموضع",
      top: "أعلى",
      bottom: "أسفل",
      right: "يمين",
      left: "يسار",
    },
  },
  he: {
    dir: "rtl",
    values: {
      open: "פתח תפריט",
      account: "חשבון",
      profile: "פרופיל",
      billing: "חיוב",
      settings: "הגדרות",
      logout: "התנתק",
      team: "הצוות",
      inviteUsers: "הזמן משתמשים",
      email: "אימייל",
      message: "הודעה",
      more: "עוד",
      calendar: "יומן",
      chat: "צ'אט",
      webhook: "Webhook",
      advanced: "מתקדם...",
      newTeam: "צוות חדש",
      view: "תצוגה",
      statusBar: "שורת סטטוס",
      activityBar: "שורת פעילות",
      panel: "לוח",
      position: "מיקום",
      top: "למעלה",
      bottom: "למטה",
      right: "ימין",
      left: "שמאל",
    },
  },
}

export function DropdownMenuRtl() {
  const { dir, language, t } = useTranslation(translations, "ar")
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set(["status-bar"])
  )
  const [position, setPosition] = React.useState("bottom")

  return (
    <DropdownMenuTrigger>
      <Button variant="outline">{t.open}</Button>
      <DropdownMenu
        placement={dir === "rtl" ? "bottom end" : "bottom start"}
        dir={dir}
        className="w-36"
        data-lang={dir === "rtl" ? language : undefined}
      >
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>{t.account}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              dir={dir}
              data-lang={dir === "rtl" ? language : undefined}
            >
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <UserIcon />
                  {t.profile}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCardIcon />
                  {t.billing}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SettingsIcon />
                  {t.settings}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t.team}</DropdownMenuLabel>
          <DropdownMenuItem>{t.team}</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>{t.inviteUsers}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              dir={dir}
              data-lang={dir === "rtl" ? language : undefined}
            >
              <DropdownMenuItem>{t.email}</DropdownMenuItem>
              <DropdownMenuItem>{t.message}</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>{t.more}</DropdownMenuSubTrigger>
                <DropdownMenuSubContent
                  dir={dir}
                  data-lang={dir === "rtl" ? language : undefined}
                >
                  <DropdownMenuItem>{t.calendar}</DropdownMenuItem>
                  <DropdownMenuItem>{t.chat}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>{t.webhook}</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{t.advanced}</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem>
            {t.newTeam}
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <DropdownMenuLabel>{t.view}</DropdownMenuLabel>
          <DropdownMenuItem id="status-bar">{t.statusBar}</DropdownMenuItem>
          <DropdownMenuItem id="activity-bar">{t.activityBar}</DropdownMenuItem>
          <DropdownMenuItem id="panel">{t.panel}</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup
          selectionMode="single"
          selectedKeys={[position]}
          onSelectionChange={(keys) => setPosition([...keys][0] as string)}
        >
          <DropdownMenuLabel>{t.position}</DropdownMenuLabel>
          <DropdownMenuItem id="top">{t.top}</DropdownMenuItem>
          <DropdownMenuItem id="bottom">{t.bottom}</DropdownMenuItem>
          <DropdownMenuItem id="right">{t.right}</DropdownMenuItem>
          <DropdownMenuItem id="left">{t.left}</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">{t.logout}</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenu>
    </DropdownMenuTrigger>
  )
}
