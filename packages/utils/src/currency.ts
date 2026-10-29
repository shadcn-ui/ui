import { normalizeDigits, toPersianDigits } from './digits.js'

export interface NumberFormatOptions {
  /** حداقل تعداد رقم اعشار */
  minimumFractionDigits?: number
  /** حداکثر تعداد رقم اعشار */
  maximumFractionDigits?: number
  /** استفاده از جداکننده هزارگان (پیش‌فرض: true) */
  useGrouping?: boolean
  /** نمایش رقم‌ها با الفبای فارسی (پیش‌فرض: true) */
  persianDigits?: boolean
  /** جداکننده هزارگان (پیش‌فرض: ",") */
  thousandsSeparator?: string
  /** جداکننده اعشار (پیش‌فرض: ".") */
  decimalSeparator?: string
}

export type CurrencyUnit = 'toman' | 'rial'

export interface CurrencyFormatOptions extends NumberFormatOptions {
  /** واحد پول؛ پیش‌فرض: تومان */
  unit?: CurrencyUnit
  /** نمایش واحد در انتهای عدد (پیش‌فرض: true) */
  withUnit?: boolean
  /** جایگزینی متن واحد پیش‌فرض */
  unitLabel?: string
}

export interface AbbreviateOptions extends NumberFormatOptions {
  /** تعداد رقم اعشار در بخش مختصرشده (پیش‌فرض: ۱) */
  fractionDigits?: number
  /** واحدهای نمایش به ترتیب هزار، میلیون، میلیارد و تریلیون */
  units?: readonly string[]
}

const CURRENCY_LABELS: Record<CurrencyUnit, string> = {
  toman: 'تومان',
  rial: 'ریال',
}

const DEFAULT_ABBREVIATION_UNITS = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'] as const

/**
 * قالب‌بندی عدد با جداکننده سه‌رقمی و امکان نمایش با رقم‌های فارسی.
 *
 * @example
 * formatNumber(1250000) // "۱,۲۵۰,۰۰۰"
 * formatNumber(1250000, { persianDigits: false }) // "1,250,000"
 */
export function formatNumber(value: number, options: NumberFormatOptions = {}): string {
  if (!Number.isFinite(value)) return ''

  const {
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping = true,
    persianDigits = true,
    thousandsSeparator = ',',
    decimalSeparator = '.',
  } = options

  const formatter = new Intl.NumberFormat('en-US', {
    useGrouping,
    minimumFractionDigits,
    maximumFractionDigits,
  })

  let formatted = formatter.format(value)

  if (useGrouping && thousandsSeparator !== ',') {
    formatted = formatted.replace(/,/g, thousandsSeparator)
  }
  if (decimalSeparator !== '.') {
    formatted = formatted.replace(/\./g, decimalSeparator)
  }

  return persianDigits ? toPersianDigits(formatted) : formatted
}

/**
 * تبدیل ورودی متنی (با رقم فارسی، جداکننده و واحد پول) به عدد.
 * برای مقدارهای نامعتبر `NaN` برمی‌گرداند.
 *
 * @example
 * parseNumber('۱٬۲۵۰٫۵۰۰ تومان') // 1250.5
 */
export function parseNumber(value: string | number): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : Number.NaN

  let normalized = normalizeDigits(value).trim()
  if (!normalized) return Number.NaN

  const isNegativeInParentheses = /^\(.*\)$/.test(normalized)
  if (isNegativeInParentheses) normalized = normalized.slice(1, -1)

  normalized = normalized
    .replace(/[٬,\u066c\u060c\s\u00a0\u202f\u2009']/g, '')
    .replace(/[٫\u066b]/g, '.')
    .replace(/تومان|ریال|درصد|٪/g, '')

  if (!/[0-9]/.test(normalized)) return Number.NaN
  if ((normalized.match(/\./g) ?? []).length > 1) return Number.NaN
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(normalized)) return Number.NaN

  const parsed = Number(normalized)
  if (!Number.isFinite(parsed)) return Number.NaN
  return isNegativeInParentheses ? -Math.abs(parsed) : parsed
}

/**
 * قالب‌بندی مبلغ به تومان یا ریال با جداکننده سه‌رقمی.
 *
 * @example
 * formatCurrency(2450000) // "۲,۴۵۰,۰۰۰ تومان"
 * formatCurrency(2450000, { unit: 'rial' }) // "۲,۴۵۰,۰۰۰ ریال"
 */
export function formatCurrency(
  value: number,
  { unit = 'toman', withUnit = true, unitLabel, ...options }: CurrencyFormatOptions = {},
): string {
  const formatted = formatNumber(value, { maximumFractionDigits: 0, ...options })
  if (!formatted) return ''
  if (!withUnit) return formatted
  return `${formatted} ${unitLabel ?? CURRENCY_LABELS[unit]}`
}

/** قالب‌بندی مبلغ به تومان. */
export function formatToman(
  value: number,
  options: Omit<CurrencyFormatOptions, 'unit'> = {},
): string {
  return formatCurrency(value, { ...options, unit: 'toman' })
}

/** قالب‌بندی مبلغ به ریال. */
export function formatRial(
  value: number,
  options: Omit<CurrencyFormatOptions, 'unit'> = {},
): string {
  return formatCurrency(value, { ...options, unit: 'rial' })
}

/**
 * خلاصه‌سازی اعداد بزرگ برای جدول‌ها و داشبوردها.
 *
 * @example
 * abbreviateNumber(12500000) // "۱۲.۵ میلیون"
 */
export function abbreviateNumber(value: number, options: AbbreviateOptions = {}): string {
  if (!Number.isFinite(value)) return ''

  const {
    fractionDigits = 1,
    units = DEFAULT_ABBREVIATION_UNITS,
    persianDigits = true,
    ...numberOptions
  } = options

  const absolute = Math.abs(value)
  let unitIndex = 0

  while (unitIndex < units.length - 1 && absolute >= 1000 ** (unitIndex + 1)) {
    unitIndex += 1
  }

  const scaled = value / 1000 ** unitIndex
  const formatted = formatNumber(scaled, {
    maximumFractionDigits: fractionDigits,
    ...numberOptions,
    persianDigits,
  })
  const suffix = units[unitIndex] ?? ''
  return suffix ? `${formatted} ${suffix}` : formatted
}

/**
 * قالب‌بندی درصد؛ مقدار ورودی همان درصد است (۱۲.۵ ← ۱۲.۵٪).
 */
export function formatPercent(
  value: number,
  options: NumberFormatOptions & { withSign?: boolean } = {},
): string {
  const { withSign = false, ...numberOptions } = options
  const formatted = formatNumber(value, { maximumFractionDigits: 1, ...numberOptions })
  if (!formatted) return ''
  const sign = withSign && value > 0 ? '+' : ''
  return `${sign}${formatted}٪`
}
