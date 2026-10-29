import {
  isLeapJalaaliYear,
  isValidJalaaliDate,
  jalaaliMonthLength,
  jalaaliToDateObject,
  toGregorian,
  toJalaali,
} from 'jalaali-js'
import { hasPersianDigits, toLatinDigits, toPersianDigits } from './digits.js'

export interface JalaliDate {
  year: number
  month: number
  day: number
}

export interface JalaliMonth {
  value: number
  label: string
}

export interface JalaliDayCell {
  /** تاریخ میلادی معادل، در ساعت ۰۰:۰۰ محلی */
  date: Date
  /** تاریخ جلالی معادل */
  jalali: JalaliDate
  /** کلید یکتای سلول، مثلاً `1403-5-12` */
  key: string
  /** روز ماه جاری */
  day: number
  /** آیا سلول به ماه انتخاب‌شده تعلق دارد؟ */
  isCurrentMonth: boolean
  /** آیا سلول امروز است؟ */
  isToday: boolean
  /** روز هفته شمسی؛ ۰ = شنبه و ۶ = جمعه */
  weekday: number
}

export interface JalaliMonthGridOptions {
  /** روز شروع هفته بر اساس `Date.getDay`؛ پیش‌فرض ۶ (شنبه) */
  weekStartsOn?: number
  /** تعداد هفته‌های تولیدشده؛ پیش‌فرض ۶ */
  weeks?: number
}

export interface FormatJalaliOptions {
  /** الگوی خروجی؛ پیش‌فرض `YYYY/MM/DD` */
  pattern?: string
  /** نمایش با رقم‌های فارسی؛ پیش‌فرض true */
  persianDigits?: boolean
}

export const JALALI_MONTHS: readonly JalaliMonth[] = [
  { value: 1, label: 'فروردین' },
  { value: 2, label: 'اردیبهشت' },
  { value: 3, label: 'خرداد' },
  { value: 4, label: 'تیر' },
  { value: 5, label: 'مرداد' },
  { value: 6, label: 'شهریور' },
  { value: 7, label: 'مهر' },
  { value: 8, label: 'آبان' },
  { value: 9, label: 'آذر' },
  { value: 10, label: 'دی' },
  { value: 11, label: 'بهمن' },
  { value: 12, label: 'اسفند' },
] as const

/** روزهای هفته از شنبه تا جمعه؛ ۰ = شنبه */
export const JALALI_WEEKDAYS = [
  'شنبه',
  'یک‌شنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
] as const

const NARROW_WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'] as const

const pad = (value: number): string => String(value).padStart(2, '0')

const isJalaliDate = (value: Date | JalaliDate): value is JalaliDate =>
  typeof (value as JalaliDate).year === 'number' &&
  typeof (value as JalaliDate).month === 'number' &&
  typeof (value as JalaliDate).day === 'number'

/** شاخص روز هفته شمسی (۰ = شنبه) از روی یک شیء Date */
export function getJalaliWeekdayIndex(date: Date): number {
  return (date.getDay() + 1) % 7
}

/** تبدیل تاریخ میلادی به جلالی */
export function gregorianToJalali(date: Date): JalaliDate {
  if (Number.isNaN(date.getTime())) {
    throw new RangeError('تاریخ میلادی نامعتبر است.')
  }
  const result = toJalaali(date)
  return { year: result.jy, month: result.jm, day: result.jd }
}

/** نام دیگر `gregorianToJalali` */
export const toJalaliDate = gregorianToJalali

/** تبدیل تاریخ جلالی به میلادی (ساعت ۰۰:۰۰ محلی) */
export function jalaliToGregorian(date: JalaliDate): Date {
  return jalaaliToDateObject(date.year, date.month, date.day)
}

/** نام دیگر `jalaliToGregorian` */
export const toGregorianDate = jalaliToGregorian

/** تاریخ جلالی امروز */
export function todayJalali(): JalaliDate {
  return gregorianToJalali(new Date())
}

/** اعتبارسنجی تاریخ جلالی */
export function isValidJalali(date: JalaliDate): boolean {
  return isValidJalaaliDate(date.year, date.month, date.day)
}

/** آیا سال جلالی کبیسه است؟ */
export function isJalaliLeapYear(year: number): boolean {
  return isLeapJalaaliYear(year)
}

/** تعداد روزهای یک ماه جلالی */
export function getJalaliMonthLength(year: number, month: number): number {
  return jalaaliMonthLength(year, month)
}

/** نام ماه جلالی */
export function getJalaliMonthName(month: number): string {
  return JALALI_MONTHS[month - 1]?.label ?? ''
}

/** برچسب‌های روزهای هفته به ترتیب شروع هفته */
export function getJalaliWeekdayLabels(weekStartsOn = 6, narrow = true): string[] {
  return Array.from({ length: 7 }, (_, index) => {
    const jsDay = (weekStartsOn + index) % 7
    const persianIndex = (jsDay + 1) % 7
    return (narrow ? NARROW_WEEKDAYS : JALALI_WEEKDAYS)[persianIndex] ?? ''
  })
}

/** نام روز هفته برای یک تاریخ میلادی یا جلالی */
export function getJalaliWeekdayName(
  value: Date | JalaliDate,
  { narrow = false }: { narrow?: boolean } = {},
): string {
  const date = isJalaliDate(value) ? jalaliToGregorian(value) : value
  const persianIndex = getJalaliWeekdayIndex(date)
  return (narrow ? NARROW_WEEKDAYS : JALALI_WEEKDAYS)[persianIndex] ?? ''
}

/**
 * تولید شبکه ۶×۷ روزهای یک ماه جلالی.
 * هفته به‌صورت پیش‌فرض از شنبه شروع می‌شود و سلول‌های ماه‌های قبل/بعد
 * نیز برای نمایش یکپارچه تقویم در شبکه قرار می‌گیرند.
 */
export function getJalaliMonthGrid(
  year: number,
  month: number,
  { weekStartsOn = 6, weeks = 6 }: JalaliMonthGridOptions = {},
): JalaliDayCell[] {
  if (!isValidJalaaliDate(year, month, 1)) {
    throw new RangeError('سال یا ماه جلالی نامعتبر است.')
  }

  const firstDay = jalaaliToDateObject(year, month, 1)
  const offset = (firstDay.getDay() - weekStartsOn + 7) % 7
  const gridStart = new Date(firstDay)
  gridStart.setDate(firstDay.getDate() - offset)

  const today = todayJalali()

  return Array.from({ length: weeks * 7 }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)

    const jalali = gregorianToJalali(date)
    return {
      date,
      jalali,
      key: `${jalali.year}-${jalali.month}-${jalali.day}`,
      day: jalali.day,
      isCurrentMonth: jalali.year === year && jalali.month === month,
      isToday:
        jalali.year === today.year && jalali.month === today.month && jalali.day === today.day,
      weekday: getJalaliWeekdayIndex(date),
    }
  })
}

/**
 * مقایسه دو تاریخ جلالی؛ خروجی منفی، صفر یا مثبت مانند `localeCompare`.
 */
export function compareJalali(a: JalaliDate, b: JalaliDate): number {
  return a.year - b.year || a.month - b.month || a.day - b.day
}

/** آیا دو تاریخ جلالی برابرند؟ */
export function isSameJalaliDate(a: JalaliDate, b: JalaliDate): boolean {
  return compareJalali(a, b) === 0
}

/** آیا تاریخ `a` قبل از `b` است؟ */
export function isBeforeJalali(a: JalaliDate, b: JalaliDate): boolean {
  return compareJalali(a, b) < 0
}

/** آیا تاریخ `a` بعد از `b` است؟ */
export function isAfterJalali(a: JalaliDate, b: JalaliDate): boolean {
  return compareJalali(a, b) > 0
}

/** آیا تاریخ جلالی داخل بازه (شامل مرزها) قرار دارد؟ */
export function isJalaliInRange(
  date: JalaliDate,
  min?: JalaliDate | null,
  max?: JalaliDate | null,
): boolean {
  if (min && isBeforeJalali(date, min)) return false
  if (max && isAfterJalali(date, max)) return false
  return true
}

/** افزودن ماه به تاریخ جلالی با اصلاح خودکار روز در انتهای ماه */
export function addJalaliMonths(date: JalaliDate, count: number): JalaliDate {
  const totalMonths = date.year * 12 + date.month - 1 + count
  const year = Math.floor(totalMonths / 12)
  const month = totalMonths - year * 12 + 1
  const day = Math.min(date.day, getJalaliMonthLength(year, month))
  return { year, month, day }
}

/** افزودن روز به تاریخ جلالی */
export function addJalaliDays(date: JalaliDate, count: number): JalaliDate {
  const gregorian = jalaliToGregorian(date)
  gregorian.setDate(gregorian.getDate() + count)
  return gregorianToJalali(gregorian)
}

/**
 * قالب‌بندی تاریخ جلالی با الگوهای `YYYY`, `YY`, `MMMM`, `MM`, `M`,
 * `DD`, `D`, `dddd` و `dd`.
 *
 * @example
 * formatJalali({ year: 1403, month: 5, day: 12 }) // "۱۴۰۳/۰۵/۱۲"
 * formatJalali(date, { pattern: 'dddd D MMMM YYYY' }) // "جمعه ۱۲ مرداد ۱۴۰۳"
 */
export function formatJalali(
  value: Date | JalaliDate,
  { pattern = 'YYYY/MM/DD', persianDigits = true }: FormatJalaliOptions = {},
): string {
  const date = isJalaliDate(value) ? value : gregorianToJalali(value)

  const formatted = pattern.replace(/dddd|YYYY|MMMM|DD|MM|YY|dd|M|D/g, (token) => {
    switch (token) {
      case 'YYYY':
        return String(date.year)
      case 'YY':
        return String(date.year).slice(-2)
      case 'MMMM':
        return getJalaliMonthName(date.month)
      case 'MM':
        return pad(date.month)
      case 'M':
        return String(date.month)
      case 'DD':
        return pad(date.day)
      case 'D':
        return String(date.day)
      case 'dddd':
        return getJalaliWeekdayName(date)
      case 'dd':
        return getJalaliWeekdayName(date, { narrow: true })
      default:
        return token
    }
  })

  return persianDigits ? toPersianDigits(formatted) : formatted
}

/** تفسیر تاریخ جلالی از رشته؛ در صورت نامعتبر بودن `null` برمی‌گرداند. */
export function parseJalaliDate(input: string): JalaliDate | null {
  const normalized = toLatinDigits(input)
    .replace(/[‌\s]+/g, ' ')
    .trim()

  const numeric = normalized.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/)
  if (numeric) {
    const [, year, month, day] = numeric
    const date = { year: Number(year), month: Number(month), day: Number(day) }
    return isValidJalali(date) ? date : null
  }

  const withMonthName = normalized.match(/^(\d{1,2})\s+([^\s]+)\s+(\d{4})$/)
  if (withMonthName) {
    const [, day, monthName, year] = withMonthName
    const normalizedMonthName = monthName?.replace(/‌/g, '')
    const month = JALALI_MONTHS.find(
      (item) => item.label === monthName || item.label.replace(/‌/g, '') === normalizedMonthName,
    )
    if (month) {
      const date = { year: Number(year), month: month.value, day: Number(day) }
      return isValidJalali(date) ? date : null
    }
  }

  return null
}

/** مقایسه سریع دو تاریخ میلادی بر اساس روز محلی */
export function isSameGregorianDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/**
 * برچسب کامل تاریخ جلالی برای `aria-label` و ابزارهای دسترس‌پذیری.
 * مثال: «جمعه ۱۲ مرداد ۱۴۰۳»
 */
export function getJalaliAccessibleLabel(value: Date | JalaliDate): string {
  return formatJalali(value, { pattern: 'dddd D MMMM YYYY' })
}

/** آیا رشته شامل رقم فارسی است؟ (بازصادرشده برای راحتی مصرف‌کنندگان تقویم) */
export const containsPersianDigits = hasPersianDigits
