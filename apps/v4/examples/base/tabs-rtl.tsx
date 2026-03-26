"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/examples/base/ui-rtl/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/examples/base/ui-rtl/tabs"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      overview: "Overview",
      analytics: "Analytics",
      reports: "Reports",
      settings: "Settings",
      overviewTitle: "Overview",
      overviewDesc:
        "View your key metrics and recent project activity. Track progress across all your active projects.",
      overviewContent: "You have 12 active projects and 3 pending tasks.",
      analyticsTitle: "Analytics",
      analyticsDesc:
        "Track performance and user engagement metrics. Monitor trends and identify growth opportunities.",
      analyticsContent: "Page views are up 25% compared to last month.",
      reportsTitle: "Reports",
      reportsDesc:
        "Generate and download your detailed reports. Export data in multiple formats for analysis.",
      reportsContent: "You have 5 reports ready and available to export.",
      settingsTitle: "Settings",
      settingsDesc:
        "Manage your account preferences and options. Customize your experience to fit your needs.",
      settingsContent: "Configure notifications, security, and themes.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      overview: "نظرة عامة",
      analytics: "التحليلات",
      reports: "التقارير",
      settings: "الإعدادات",
      overviewTitle: "نظرة عامة",
      overviewDesc:
        "عرض مقاييسك الرئيسية وأنشطة المشروع الأخيرة. تتبع التقدم عبر جميع مشاريعك النشطة.",
      overviewContent: "لديك ١٢ مشروعًا نشطًا و٣ مهام معلقة.",
      analyticsTitle: "التحليلات",
      analyticsDesc:
        "تتبع مقاييس الأداء ومشاركة المستخدمين. راقب الاتجاهات وحدد فرص النمو.",
      analyticsContent: "زادت مشاهدات الصفحة بنسبة ٢٥٪ مقارنة بالشهر الماضي.",
      reportsTitle: "التقارير",
      reportsDesc:
        "إنشاء وتنزيل تقاريرك التفصيلية. تصدير البيانات بتنسيقات متعددة للتحليل.",
      reportsContent: "لديك ٥ تقارير جاهزة ومتاحة للتصدير.",
      settingsTitle: "الإعدادات",
      settingsDesc:
        "إدارة تفضيلات حسابك وخياراته. تخصيص تجربتك لتناسب احتياجاتك.",
      settingsContent: "تكوين الإشعارات والأمان والسمات.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      overview: "סקירה כללית",
      analytics: "אנליטיקה",
      reports: "דוחות",
      settings: "הגדרות",
      overviewTitle: "סקירה כללית",
      overviewDesc:
        "הצג את המדדים העיקריים שלך ופעילות הפרויקט האחרונה. עקוב אחר התקדמות בכל הפרויקטים הפעילים שלך.",
      overviewContent: "יש לך 12 פרויקטים פעילים ו-3 משימות ממתינות.",
      analyticsTitle: "אנליטיקה",
      analyticsDesc:
        "עקוב אחר ביצועים ומדדי מעורבות משתמשים. עקוב אחר מגמות וזהה הזדמנויות צמיחה.",
      analyticsContent: "צפיות בדף עלו ב-25% בהשוואה לחודש שעבר.",
      reportsTitle: "דוחות",
      reportsDesc:
        "צור והורד את הדוחות המפורטים שלך. ייצא נתונים בפורמטים מרובים לניתוח.",
      reportsContent: "יש לך 5 דוחות מוכנים וזמינים לייצוא.",
      settingsTitle: "הגדרות",
      settingsDesc:
        "נהל את העדפות החשבון והאפשרויות שלך. התאם אישית את החוויה שלך כך שתתאים לצרכים שלך.",
      settingsContent: "הגדר התראות, אבטחה וערכות נושא.",
    },
  },
}

export function TabsRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <Tabs defaultValue="overview" className="w-full max-w-sm" dir={dir}>
      <TabsList dir={dir}>
        <TabsTrigger value="overview">{t.overview}</TabsTrigger>
        <TabsTrigger value="analytics">{t.analytics}</TabsTrigger>
        <TabsTrigger value="reports">{t.reports}</TabsTrigger>
        <TabsTrigger value="settings">{t.settings}</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card dir={dir}>
          <CardHeader>
            <CardTitle>{t.overviewTitle}</CardTitle>
            <CardDescription>{t.overviewDesc}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {t.overviewContent}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="analytics">
        <Card dir={dir}>
          <CardHeader>
            <CardTitle>{t.analyticsTitle}</CardTitle>
            <CardDescription>{t.analyticsDesc}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {t.analyticsContent}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reports">
        <Card dir={dir}>
          <CardHeader>
            <CardTitle>{t.reportsTitle}</CardTitle>
            <CardDescription>{t.reportsDesc}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {t.reportsContent}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card dir={dir}>
          <CardHeader>
            <CardTitle>{t.settingsTitle}</CardTitle>
            <CardDescription>{t.settingsDesc}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {t.settingsContent}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
