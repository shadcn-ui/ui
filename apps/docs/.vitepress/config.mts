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
            { text: 'برچسب', link: '/components/label' },
            { text: 'چک‌باکس', link: '/components/checkbox' },
            { text: 'سوییچ', link: '/components/switch' },
          ],
        },
        {
          text: 'لایه‌های رویی',
          items: [
            { text: 'دیالوگ', link: '/components/dialog' },
            { text: 'منوی کشویی', link: '/components/dropdown-menu' },
          ],
        },
        {
          text: 'کامپوننت‌های فارسی',
          items: [
            { text: 'تقویم جلالی', link: '/components/calendar' },
            { text: 'تاریخ‌انتخاب‌کن', link: '/components/date-picker' },
            { text: 'جدول داده', link: '/components/data-table' },
            { text: 'صفحه‌بندی', link: '/components/pagination' },
          ],
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
