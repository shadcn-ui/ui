import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ember-ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ember-ui/tabs';

<template>
  <Tabs @defaultValue="overview" @class="w-full max-w-sm" dir="rtl">
    <TabsList dir="rtl">
      <TabsTrigger @value="overview">نظرة عامة</TabsTrigger>
      <TabsTrigger @value="analytics">التحليلات</TabsTrigger>
      <TabsTrigger @value="reports">التقارير</TabsTrigger>
      <TabsTrigger @value="settings">الإعدادات</TabsTrigger>
    </TabsList>
    <TabsContent @value="overview">
      <Card dir="rtl">
        <CardHeader>
          <CardTitle>نظرة عامة</CardTitle>
          <CardDescription>
            عرض مقاييسك الرئيسية وأنشطة المشروع الأخيرة. تتبع التقدم عبر جميع مشاريعك النشطة.
          </CardDescription>
        </CardHeader>
        <CardContent @class="text-sm text-muted-foreground">
          لديك ١٢ مشروعًا نشطًا و٣ مهام معلقة.
        </CardContent>
      </Card>
    </TabsContent>
    <TabsContent @value="analytics">
      <Card dir="rtl">
        <CardHeader>
          <CardTitle>التحليلات</CardTitle>
          <CardDescription>
            تتبع مقاييس الأداء ومشاركة المستخدمين. راقب الاتجاهات وحدد فرص النمو.
          </CardDescription>
        </CardHeader>
        <CardContent @class="text-sm text-muted-foreground">
          زادت مشاهدات الصفحة بنسبة ٢٥٪ مقارنة بالشهر الماضي.
        </CardContent>
      </Card>
    </TabsContent>
    <TabsContent @value="reports">
      <Card dir="rtl">
        <CardHeader>
          <CardTitle>التقارير</CardTitle>
          <CardDescription>
            إنشاء وتنزيل تقاريرك التفصيلية. تصدير البيانات بتنسيقات متعددة للتحليل.
          </CardDescription>
        </CardHeader>
        <CardContent @class="text-sm text-muted-foreground">
          لديك ٥ تقارير جاهزة ومتاحة للتصدير.
        </CardContent>
      </Card>
    </TabsContent>
    <TabsContent @value="settings">
      <Card dir="rtl">
        <CardHeader>
          <CardTitle>الإعدادات</CardTitle>
          <CardDescription>
            إدارة تفضيلات حسابك وخياراته. تخصيص تجربتك لتناسب احتياجاتك.
          </CardDescription>
        </CardHeader>
        <CardContent @class="text-sm text-muted-foreground">
          تكوين الإشعارات والأمان والسمات.
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</template>
