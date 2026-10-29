const PERSIAN_ZERO = 0x06f0
const ARABIC_INDIC_ZERO = 0x0660

const PERSIAN_DIGIT_REGEX = /[\u06f0-\u06f9]/
const ARABIC_INDIC_DIGIT_REGEX = /[\u0660-\u0669]/
const ANY_EASTERN_DIGIT_REGEX = /[\u06f0-\u06f9\u0660-\u0669]/g
const ASCII_DIGIT_REGEX = /[0-9]/g

/**
 * تبدیل رقم‌های لاتین (0-9) به رقم‌های فارسی (۰-۹).
 * سایر کاراکترها بدون تغییر باقی می‌مانند.
 */
export function toPersianDigits(value: string | number | bigint): string {
  return String(value).replace(ASCII_DIGIT_REGEX, (digit) =>
    String.fromCharCode(PERSIAN_ZERO + Number(digit)),
  )
}

/**
 * تبدیل رقم‌های فارسی و عربی به رقم‌های لاتین.
 */
export function toLatinDigits(value: string | number | bigint): string {
  return String(value).replace(ANY_EASTERN_DIGIT_REGEX, (digit) => {
    const code = digit.charCodeAt(0)
    const zero = code >= PERSIAN_ZERO ? PERSIAN_ZERO : ARABIC_INDIC_ZERO
    return String(code - zero)
  })
}

/** نام دیگر `toLatinDigits` برای خوانایی بیشتر در پروژه‌های فارسی. */
export const toEnglishDigits = toLatinDigits

/** نرمال‌سازی رقم‌های فارسی/عربی به لاتین. */
export const normalizeDigits = toLatinDigits

/** آیا رشته شامل حداقل یک رقم فارسی است؟ */
export function hasPersianDigits(value: string): boolean {
  return PERSIAN_DIGIT_REGEX.test(value)
}

/** آیا رشته شامل حداقل یک رقم عربی است؟ */
export function hasArabicIndicDigits(value: string): boolean {
  return ARABIC_INDIC_DIGIT_REGEX.test(value)
}

/**
 * تبدیل رقم‌های لاتین داخل یک رشته به فارسی، در حالی که متن فارسی حفظ می‌شود.
 * مثال: `"کد 12345"` ← `"کد ۱۲۳۴۵"`
 */
export function localizeDigits(value: string): string {
  return toPersianDigits(value)
}
