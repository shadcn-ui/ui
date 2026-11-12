import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'

const root = fileURLToPath(new URL('../../..', import.meta.url))
const uiSource = fileURLToPath(new URL('../../../packages/ui/src', import.meta.url))
const utilsSource = fileURLToPath(new URL('../../../packages/utils/src/index.ts', import.meta.url))

export default defineConfig({
  lang: 'fa-IR',
  dir: 'rtl',
  title: 'سازه UI',
  description: 'کتابخانه رابط کاربری راست‌به‌چپ و فارسی برای Vue 3',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#0f766e' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'apple-touch-icon', href: '/logo.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'سازه UI' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'کتابخانه رابط کاربری راست‌به‌چپ و فارسی برای Vue 3',
      },
    ],
    [
      'script',
      {},
      "document.documentElement.setAttribute('dir','rtl');document.documentElement.setAttribute('lang','fa-IR');document.documentElement.classList.add('fa');",
    ],
  ],
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'جستجو',
            buttonAriaLabel: 'جستجو در مستندات',
          },
          modal: {
            displayDetails: 'نمایش جزئیات',
            resetButtonTitle: 'پاک کردن جستجو',
            backButtonTitle: 'بازگشت',
            noResultsText: 'نتیجه‌ای پیدا نشد',
            footer: {
              selectText: 'انتخاب',
              navigateText: 'جابه‌جایی',
              closeText: 'بستن',
            },
          },
        },
      },
    },
    logo: '/logo.svg',
    siteTitle: 'سازه UI',
    nav: [
      { text: 'خانه', link: '/' },
      { text: 'شروع', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: 'کامپوننت‌ها', link: '/components/button', activeMatch: '/components/' },
      { text: 'ابزارها', link: '/guide/utilities', activeMatch: '/guide/utilities' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'شروع به کار',
          items: [
            { text: 'درباره سازه UI', link: '/guide/introduction' },
            { text: 'نصب و راه‌اندازی', link: '/guide/installation' },
            { text: 'راست‌به‌چپ و Tailwind', link: '/guide/rtl' },
            { text: 'ابزارهای فارسی و جلالی', link: '/guide/utilities' },
          ],
        },
      ],
      '/components/': [
        {
          text: 'پایه',
          items: [
            { text: 'دکمه', link: '/components/button' },
            { text: 'ورودی', link: '/components/input' },
            { text: 'ناحیه متن', link: '/components/textarea' },
            { text: 'لیبل', link: '/components/label' },
            { text: 'چک‌باکس', link: '/components/checkbox' },
            { text: 'سوییچ', link: '/components/switch' },
            { text: 'سلکت باکس', link: '/components/select' },
            { text: 'کمبو باکس ', link: '/components/combobox' },
            { text: 'گروه دکمه رادیویی', link: '/components/radio-group' },
            { text: 'اسلایدر', link: '/components/slider' },
            { text: 'تاگل', link: '/components/toggle' },
            { text: 'گروه تاگل', link: '/components/toggle-group' },
            { text: 'ورودی یک‌بارمصرف', link: '/components/input-otp' },
            { text: 'ورودی پین', link: '/components/pin-input' },
            { text: 'فیلد عددی', link: '/components/number-field' },
            { text: 'ورودی برچسب', link: '/components/tags-input' },
            { text: 'فرم', link: '/components/form' },
            { text: 'ارائه‌دهنده سازه', link: '/components/provider' },
          ],
        },
        {
          text: 'ناوبری و چیدمان',
          items: [
            { text: 'آکاردئون', link: '/components/accordion' },
            { text: 'محتوای تاشو', link: '/components/collapsible' },
            { text: 'نسبت تصویر', link: '/components/aspect-ratio' },
            { text: 'جداکننده', link: '/components/separator' },
            { text: 'ناحیه اسکرول', link: '/components/scroll-area' },
            { text: 'بردکرامب', link: '/components/breadcrumb' },
            { text: 'منوی ناوبری', link: '/components/navigation-menu' },
            { text: 'نوار منو', link: '/components/menubar' },
            { text: 'تب ها', link: '/components/tabs' },
            { text: 'جدول', link: '/components/table' },
            { text: 'تغییر اندازه', link: '/components/resizable' },
            { text: 'پیجینیشن', link: '/components/pagination' },
            { text: 'مراحل', link: '/components/stepper' },
          ],
        },
        {
          text: 'نمایش داده',
          items: [
            { text: 'کارت', link: '/components/card' },
            { text: 'نشان', link: '/components/badge' },
            { text: 'آواتار', link: '/components/avatar' },
            { text: 'تقویم جلالی', link: '/components/calendar' },
            { text: 'تقویم بازه‌ای', link: '/components/range-calendar' },
            { text: 'دیت پیکر', link: '/components/date-picker' },
            { text: 'جدول داده', link: '/components/data-table' },
          ],
        },
        {
          text: 'بازخورد و وضعیت',
          items: [
            { text: 'هشدار', link: '/components/alert' },
            { text: 'دیالوگ هشدار', link: '/components/alert-dialog' },
            { text: 'پراگرس ', link: '/components/progress' },
            { text: 'اسکلت', link: '/components/skeleton' },
            { text: 'اعلان', link: '/components/toast' },
            { text: 'سونر', link: '/components/sonner' },
          ],
        },
        {
          text: 'لایه‌های رویی',
          items: [
            { text: 'دیالوگ', link: '/components/dialog' },
            { text: 'کشو', link: '/components/sheet' },
            { text: 'پاپ‌اور', link: '/components/popover' },
            { text: 'تولتیپ', link: '/components/tooltip' },
            { text: 'کارت شناور', link: '/components/hover-card' },
            { text: 'منوی کشویی', link: '/components/dropdown-menu' },
            { text: 'منوی زمینه‌ای', link: '/components/context-menu' },
            { text: 'کامند', link: '/components/command' },
          ],
        },
        {
          text: 'اجزای تکمیلی Shadcn',
          items: [
            { text: 'پیوست', link: '/components/attachment' },
            { text: 'حباب گفتگو', link: '/components/bubble' },
            { text: 'گروه دکمه', link: '/components/button-group' },
            { text: 'چرخ‌وفلک', link: '/components/carousel' },
            { text: 'نمودار', link: '/components/chart' },
            { text: 'بلوک کد', link: '/components/code-block' },
            { text: 'جهت نوشتار', link: '/components/direction' },
            { text: 'کشوی پایین‌رو', link: '/components/drawer' },
            { text: 'حالت خالی', link: '/components/empty' },
            { text: 'فیلد', link: '/components/field' },
            { text: 'گروه ورودی', link: '/components/input-group' },
            { text: 'آیتم', link: '/components/item' },
            { text: 'کلید صفحه‌کلید', link: '/components/kbd' },
            { text: 'نشانگر', link: '/components/marker' },
            { text: 'پیام', link: '/components/message' },
            { text: 'پیمایشگر پیام', link: '/components/message-scroller' },
            { text: 'انتخاب‌گر بومی', link: '/components/native-select' },
            { text: 'پرسش‌نامه', link: '/components/questionnaire' },
            { text: 'نشانگر بارگذاری', link: '/components/spinner' },
            { text: 'نوار کناری', link: '/components/sidebar' },
            { text: 'ردگیری', link: '/components/trace' },
            { text: 'تایپوگرافی', link: '/components/typography' },
          ],
        },
        {
          text: 'کامپوننت‌های فارسی',
          items: [{ text: 'نمای کلی کامپوننت‌ها', link: '/components/overview' }],
        },
      ],
    },
    outline: {
      label: 'در این صفحه',
      level: [2, 3],
    },
    docFooter: {
      prev: 'صفحه قبلی',
      next: 'صفحه بعدی',
    },
    lastUpdated: {
      text: 'آخرین به‌روزرسانی',
      formatOptions: { dateStyle: 'short', timeStyle: 'short' },
    },
    darkModeSwitchLabel: 'حالت تاریک',
    lightModeSwitchTitle: 'تغییر به حالت روشن',
    darkModeSwitchTitle: 'تغییر به حالت تاریک',
    returnToTopLabel: 'بازگشت به بالا',
    sidebarMenuLabel: 'فهرست',
    outlineTitle: 'در این صفحه',
    externalLinkIcon: true,
    socialLinks: [{ icon: 'github', link: 'https://github.com/ReyhaneENS/saaze-ui' }],
    footer: {
      message: 'ساخته‌شده با عشق برای وب فارسی',
      copyright: 'پروژه سازه UI — تحت مجوز MIT',
    },
    editLink: {
      pattern: 'https://github.com/ReyhaneENS/saaze-ui/edit/main/apps/docs/:path',
      text: 'ویرایش این صفحه',
    },
  },
  vite: {
    resolve: {
      alias: {
        '@saaze/ui': uiSource,
        '@saaze/utils': utilsSource,
        '@': uiSource,
      },
    },
    server: {
      fs: {
        allow: [root],
      },
    },
  },
})
