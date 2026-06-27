<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/ui/navigation-menu'
// eslint-disable-next-line import/no-named-default
import { default as ListItem } from './navigation-menu-item.vue'

const components: { title: string, href: string, description: string }[] = [
  {
    title: 'حوار التنبيه',
    href: '/docs/primitives/alert-dialog',
    description: 'حوار نافذة يقطع المستخدم بمحتوى مهم ويتوقع استجابة.',
  },
  {
    title: 'بطاقة التحويم',
    href: '/docs/primitives/hover-card',
    description: 'للمستخدمين المبصرين لمعاينة المحتوى المتاح خلف الرابط.',
  },
  {
    title: 'التقدم',
    href: '/docs/primitives/progress',
    description: 'يعرض مؤشرًا يوضح تقدم إتمام المهمة، عادةً يتم عرضه كشريط تقدم.',
  },
  {
    title: 'منطقة التمرير',
    href: '/docs/primitives/scroll-area',
    description: 'يفصل المحتوى بصريًا أو دلاليًا.',
  },
  {
    title: 'التبويبات',
    href: '/docs/primitives/tabs',
    description: 'مجموعة من أقسام المحتوى المتعددة الطبقات—المعروفة بألواح التبويب—التي يتم عرضها واحدة في كل مرة.',
  },
  {
    title: 'تلميح',
    href: '/docs/primitives/tooltip',
    description: 'نافذة منبثقة تعرض معلومات متعلقة بعنصر عندما يتلقى العنصر التركيز على لوحة المفاتيح أو عند تحويم الماوس فوقه.',
  },
]
</script>

<template>
  <NavigationMenu dir="rtl">
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>البدء</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="w-96">
            <ListItem to="/docs" title="مقدمة">
              مكونات قابلة لإعادة الاستخدام مبنية باستخدام Tailwind CSS.
            </ListItem>
            <ListItem to="/docs/installation" title="التثبيت">
              كيفية تثبيت التبعيات وتنظيم تطبيقك.
            </ListItem>
            <ListItem to="/docs/primitives/typography" title="الطباعة">
              أنماط للعناوين والفقرات والقوائم...إلخ
            </ListItem>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem class="hidden md:flex">
        <NavigationMenuTrigger>المكونات</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
            <ListItem
              v-for="component in components"
              :key="component.title"
              :title="component.title"
              :to="component.href"
            >
              {{ component.description }}
            </ListItem>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink as-child :class="navigationMenuTriggerStyle()">
          <a href="/docs">الوثائق</a>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
