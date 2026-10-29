# ابزارهای فارسی و جلالی

<div class="saaze-badges">
  <span>@saaze/utils</span>
  <span>Digits</span>
  <span>Currency</span>
  <span>Jalali</span>
</div>

<p class="saaze-lead">
  بسته <code>@saaze/utils</code> منطق مشترک اعداد، مبلغ و تاریخ را در یک جا جمع می‌کند تا
  کامپوننت‌ها و برنامه شما یک رفتار یکسان داشته باشند.
</p>

```ts
import {
  formatCurrency,
  formatJalali,
  formatNumber,
  parseNumber,
  toPersianDigits,
} from '@saaze/utils'
```

## رقم‌ها

| تابع                   | ورودی                        | خروجی     | توضیح                           |
| ---------------------- | ---------------------------- | --------- | ------------------------------- |
| `toPersianDigits`      | `string \| number \| bigint` | `string`  | تبدیل `0-9` به `۰-۹`            |
| `toLatinDigits`        | `string \| number \| bigint` | `string`  | تبدیل رقم فارسی و عربی به لاتین |
| `toEnglishDigits`      | همان                         | `string`  | نام دیگر `toLatinDigits`        |
| `normalizeDigits`      | همان                         | `string`  | نام دیگر `toLatinDigits`        |
| `localizeDigits`       | `string`                     | `string`  | فارسی‌کردن رقم‌های داخل متن     |
| `hasPersianDigits`     | `string`                     | `boolean` | آیا رقم فارسی دارد؟             |
| `hasArabicIndicDigits` | `string`                     | `boolean` | آیا رقم عربی دارد؟              |

```ts
toPersianDigits('کد 1404') // "کد ۱۴۰۴"
toLatinDigits('۰۱۴۲-۳۶۵') // "0142-365"
toLatinDigits('١٢٣ تومان') // "123 تومان"
hasPersianDigits('سفارش ۱۲') // true
```

::: tip ورودی‌های ترکیبی
`toLatinDigits` هر دو نوع رقم فارسی و عربی-هندی را می‌شناسد؛ بنابراین برای پردازش ورودی
کاربر (صفحه‌کلید فارسی یا عربی) امن است.
:::

## عدد، مبلغ و درصد

### قالب‌بندی عدد

```ts
formatNumber(1_250_000) // "۱,۲۵۰,۰۰۰"
formatNumber(1_250_000, { persianDigits: false }) // "1,250,000"
formatNumber(1234.567, { maximumFractionDigits: 2 }) // "۱,۲۳۴.۵۷"
formatNumber(1234567.891, {
  persianDigits: false,
  thousandsSeparator: '٬',
  decimalSeparator: '٫',
  maximumFractionDigits: 2,
}) // "1٬234٬567٫89"
```

گزینه‌های `NumberFormatOptions`:

| گزینه                   | پیش‌فرض | توضیح              |
| ----------------------- | ------- | ------------------ |
| `minimumFractionDigits` | —       | حداقل رقم اعشار    |
| `maximumFractionDigits` | —       | حداکثر رقم اعشار   |
| `useGrouping`           | `true`  | جداکننده سه‌رقمی   |
| `persianDigits`         | `true`  | نمایش با رقم فارسی |
| `thousandsSeparator`    | `","`   | جداکننده هزارگان   |
| `decimalSeparator`      | `"."`   | جداکننده اعشار     |

### پول

```ts
formatCurrency(2_450_000) // "۲,۴۵۰,۰۰۰ تومان"
formatCurrency(2_450_000, { unit: 'rial' }) // "۲,۴۵۰,۰۰۰ ریال"
formatCurrency(2_450_000, { withUnit: false }) // "۲,۴۵۰,۰۰۰"
formatToman(890_000) // "۸۹۰,۰۰۰ تومان"
formatRial(890_000) // "۸۹۰,۰۰۰ ریال"
```

`formatCurrency` به‌صورت پیش‌فرض رقم اعشار را حذف می‌کند و برای مبالغ تومان و ریال مناسب است.
با `unitLabel` می‌توانید واحد دلخواه بدهید:

```ts
formatCurrency(1200, { unitLabel: 'سکه' }) // "۱,۲۰۰ سکه"
```

### تفسیر ورودی کاربر

```ts
parseNumber('۱٬۲۵۰٫۵۰۰ تومان') // 1250.5
parseNumber('(۲,۰۰۰)') // -2000
parseNumber('۱۲۳') // 123
parseNumber('سلام') // NaN
```

`parseNumber` رقم فارسی و عربی، جداکننده‌های فارسی/عربی، واحد تومان و ریال و پرانتز منفی را
می‌فهمد. برای ورودی نامعتبر `NaN` برمی‌گرداند.

### خلاصه‌سازی و درصد

```ts
abbreviateNumber(12_500_000) // "۱۲.۵ میلیون"
abbreviateNumber(980_000, { fractionDigits: 0 }) // "۹۸۰ هزار"
formatPercent(12.5) // "۱۲.۵٪"
formatPercent(8.2, { withSign: true }) // "+۸.۲٪"
```

واحدهای پیش‌فرض خلاصه‌سازی: هزار، میلیون، میلیارد و تریلیون. می‌توانید با `units` آرایه
دلخواه بدهید.

## تاریخ جلالی

### تبدیل و اعتبارسنجی

```ts
import { gregorianToJalali, jalaliToGregorian, todayJalali, isValidJalali } from '@saaze/utils'

const jalali = gregorianToJalali(new Date(2026, 9, 28))
// { year: 1405, month: 8, day: 6 }

const date = jalaliToGregorian({ year: 1405, month: 8, day: 6 })
// Date معادل میلادی، ساعت ۰۰:۰۰ محلی

todayJalali() // تاریخ جلالی امروز
isValidJalali({ year: 1405, month: 13, day: 1 }) // false
```

### قالب‌بندی و تفسیر

```ts
formatJalali({ year: 1405, month: 8, day: 6 }) // "۱۴۰۵/۰۸/۰۶"
formatJalali(new Date(), { pattern: 'dddd D MMMM YYYY' })
// "چهارشنبه ۶ آبان ۱۴۰۵"

formatJalali(new Date(), {
  pattern: 'YYYY/MM/DD',
  persianDigits: false,
}) // "1405/08/06"

parseJalaliDate('۱۴۰۵/۰۸/۰۶') // { year: 1405, month: 8, day: 6 }
parseJalaliDate('۶ آبان ۱۴۰۵') // { year: 1405, month: 8, day: 6 }
parseJalaliDate('۱۴۰۵/۱۳/۰۱') // null
```

الگوهای پشتیبانی‌شده: `YYYY`، `YY`، `MMMM`، `MM`، `M`، `DD`، `D`، `dddd` و `dd`.

### شبکه تقویم

```ts
const grid = getJalaliMonthGrid(1405, 8, { weekStartsOn: 6 })
// ۴۲ سلول؛ شش ردیف هفت‌ستونه
```

هر سلول `JalaliDayCell` شامل این فیلدهاست:

| فیلد             | نوع          | توضیح                         |
| ---------------- | ------------ | ----------------------------- |
| `date`           | `Date`       | معادل میلادی، ساعت ۰۰:۰۰ محلی |
| `jalali`         | `JalaliDate` | سال، ماه و روز جلالی          |
| `key`            | `string`     | کلید یکتا مثل `1405-8-6`      |
| `day`            | `number`     | روز ماه                       |
| `isCurrentMonth` | `boolean`    | متعلق به ماه انتخاب‌شده       |
| `isToday`        | `boolean`    | آیا امروز است؟                |
| `weekday`        | `number`     | ۰ = شنبه تا ۶ = جمعه          |

### توابع کمکی

| تابع                                           | توضیح                        |
| ---------------------------------------------- | ---------------------------- |
| `getJalaliMonthName(month)`                    | نام ماه، مثلاً «آبان»        |
| `getJalaliWeekdayName(date, { narrow })`       | نام روز هفته                 |
| `getJalaliWeekdayLabels(weekStartsOn, narrow)` | برچسب‌های سرستون تقویم       |
| `getJalaliMonthLength(year, month)`            | تعداد روزهای ماه             |
| `isJalaliLeapYear(year)`                       | سال کبیسه                    |
| `compareJalali(a, b)`                          | مقایسه دو تاریخ              |
| `isSameJalaliDate(a, b)`                       | برابری دو تاریخ              |
| `isBeforeJalali(a, b)` / `isAfterJalali(a, b)` | مقایسه ترتیبی                |
| `isJalaliInRange(date, min, max)`              | قرار داشتن در بازه           |
| `addJalaliDays(date, count)`                   | افزودن/کاهش روز              |
| `addJalaliMonths(date, count)`                 | افزودن/کاهش ماه با اصلاح روز |
| `getJalaliAccessibleLabel(value)`              | برچسب کامل برای ARIA         |

```ts
getJalaliMonthName(8) // "آبان"
getJalaliMonthLength(1405, 12) // 29 یا 30 بسته به کبیسه بودن
isJalaliInRange({ year: 1405, month: 8, day: 6 }, min, max)
addJalaliMonths({ year: 1405, month: 6, day: 31 }, 1)
// { year: 1405, month: 7, day: 30 } — روز با طول ماه جدید اصلاح می‌شود
```

## استفاده در جدول داده

```ts
const columns = [
  {
    key: 'amount',
    header: 'مبلغ',
    align: 'end',
    format: (value: unknown) => formatToman(Number(value)),
  },
  {
    key: 'date',
    header: 'تاریخ',
    format: (value: unknown) =>
      value instanceof Date ? formatJalali(value, { pattern: 'YYYY/MM/DD' }) : '—',
  },
]
```

`DataTable` به‌صورت خودکار `Date` را جلالی، `number` را با `formatNumber` و `boolean` را با
«بله/خیر» نمایش می‌دهد؛ اما `format` کنترل کامل می‌دهد.
