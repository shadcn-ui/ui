import { describe, expect, it } from 'vitest'
import {
  abbreviateNumber,
  addJalaliDays,
  addJalaliMonths,
  compareJalali,
  formatCurrency,
  formatJalali,
  formatNumber,
  formatPercent,
  getJalaliMonthGrid,
  getJalaliMonthLength,
  getJalaliWeekdayLabels,
  getJalaliWeekdayName,
  gregorianToJalali,
  isJalaliInRange,
  isJalaliLeapYear,
  isSameJalaliDate,
  jalaliToGregorian,
  parseJalaliDate,
  parseNumber,
  toLatinDigits,
  toPersianDigits,
} from './index.js'

describe('digits', () => {
  it('converts Latin digits to Persian and back', () => {
    expect(toPersianDigits('0142-365')).toBe('۰۱۴۲-۳۶۵')
    expect(toLatinDigits('۰۱۴۲-۳۶۵')).toBe('0142-365')
  })

  it('converts Arabic-Indic digits and leaves other characters untouched', () => {
    expect(toLatinDigits('١٢٣ تومان')).toBe('123 تومان')
    expect(toPersianDigits('کد 42')).toBe('کد ۴۲')
  })
})

describe('number and currency formatting', () => {
  it('formats with Persian digits and three-digit grouping by default', () => {
    expect(formatNumber(1_250_000)).toBe('۱,۲۵۰,۰۰۰')
    expect(formatNumber(1_250_000, { persianDigits: false })).toBe('1,250,000')
  })

  it('supports custom separators and fractions', () => {
    expect(
      formatNumber(1234567.891, {
        persianDigits: false,
        thousandsSeparator: '٬',
        decimalSeparator: '٫',
        maximumFractionDigits: 2,
      }),
    ).toBe('1٬234٬567٫89')
  })

  it('formats Toman and Rial amounts', () => {
    expect(formatCurrency(2_450_000)).toBe('۲,۴۵۰,۰۰۰ تومان')
    expect(formatCurrency(2_450_000, { unit: 'rial' })).toBe('۲,۴۵۰,۰۰۰ ریال')
    expect(formatCurrency(2_450_000, { withUnit: false })).toBe('۲,۴۵۰,۰۰۰')
    expect(formatCurrency(2_450_000, { persianDigits: false })).toBe('2,450,000 تومان')
  })

  it('parses localized numeric input', () => {
    expect(parseNumber('۱٬۲۵۰٫۵۰۰ تومان')).toBe(1250.5)
    expect(parseNumber('١,250,000 ریال')).toBe(1_250_000)
    expect(parseNumber('(۱,۲۰۰)')).toBe(-1200)
    expect(parseNumber('متن نامعتبر')).toBeNaN()
    expect(parseNumber('')).toBeNaN()
  })

  it('abbreviates large numbers in Persian', () => {
    expect(abbreviateNumber(12_500_000)).toBe('۱۲.۵ میلیون')
    expect(abbreviateNumber(2_000)).toBe('۲ هزار')
    expect(abbreviateNumber(450)).toBe('۴۵۰')
  })

  it('formats percentages', () => {
    expect(formatPercent(12.5)).toBe('۱۲.۵٪')
    expect(formatPercent(7.25, { maximumFractionDigits: 1, persianDigits: false })).toBe('7.3٪')
  })
})

describe('Jalali calendar', () => {
  it('converts Gregorian and Jalali dates both ways', () => {
    expect(gregorianToJalali(new Date(2024, 2, 20))).toEqual({ year: 1403, month: 1, day: 1 })
    expect(jalaliToGregorian({ year: 1403, month: 1, day: 1 })).toEqual(new Date(2024, 2, 20))
    expect(gregorianToJalali(new Date(2024, 7, 2))).toEqual({ year: 1403, month: 5, day: 12 })
  })

  it('handles leap years and month lengths', () => {
    expect(isJalaliLeapYear(1395)).toBe(true)
    expect(isJalaliLeapYear(1394)).toBe(false)
    expect(getJalaliMonthLength(1395, 12)).toBe(30)
    expect(getJalaliMonthLength(1394, 12)).toBe(29)
  })

  it('formats Jalali dates and weekdays', () => {
    expect(formatJalali({ year: 1403, month: 5, day: 12 })).toBe('۱۴۰۳/۰۵/۱۲')
    expect(formatJalali({ year: 1403, month: 5, day: 12 }, { persianDigits: false })).toBe(
      '1403/05/12',
    )
    expect(
      formatJalali(new Date(2024, 7, 2), {
        pattern: 'dddd D MMMM YYYY',
      }),
    ).toBe('جمعه ۱۲ مرداد ۱۴۰۳')
    expect(getJalaliWeekdayName({ year: 1403, month: 5, day: 12 })).toBe('جمعه')
  })

  it('parses Jalali dates from numeric and month-name input', () => {
    expect(parseJalaliDate('۱۴۰۳/۰۵/۱۲')).toEqual({ year: 1403, month: 5, day: 12 })
    expect(parseJalaliDate('1403-5-12')).toEqual({ year: 1403, month: 5, day: 12 })
    expect(parseJalaliDate('۱۲ مرداد ۱۴۰۳')).toEqual({ year: 1403, month: 5, day: 12 })
    expect(parseJalaliDate('۱۴۰۳/۱۳/۰۱')).toBeNull()
    expect(parseJalaliDate('امروز')).toBeNull()
  })

  it('creates a Saturday-first six-week grid', () => {
    const grid = getJalaliMonthGrid(1403, 5)
    expect(grid).toHaveLength(42)
    expect(getJalaliWeekdayLabels()).toEqual(['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'])
    expect(getJalaliWeekdayLabels(6, false)[0]).toBe('شنبه')
    expect(grid[0]?.date.getDay()).toBe(6)
    expect(grid.find((cell) => cell.isCurrentMonth)?.jalali).toEqual({
      year: 1403,
      month: 5,
      day: 1,
    })
    expect(grid.filter((cell) => cell.isCurrentMonth)).toHaveLength(31)
  })

  it('adds days and months with end-of-month clamping', () => {
    expect(addJalaliMonths({ year: 1403, month: 6, day: 31 }, 1)).toEqual({
      year: 1403,
      month: 7,
      day: 30,
    })
    expect(addJalaliMonths({ year: 1403, month: 12, day: 29 }, 1)).toEqual({
      year: 1404,
      month: 1,
      day: 29,
    })
    expect(addJalaliDays({ year: 1403, month: 12, day: 29 }, 1)).toEqual({
      year: 1403,
      month: 12,
      day: 30,
    })
  })

  it('compares and checks ranges', () => {
    expect(compareJalali({ year: 1403, month: 1, day: 2 }, { year: 1403, month: 1, day: 1 })).toBe(
      1,
    )
    expect(
      isSameJalaliDate({ year: 1403, month: 5, day: 12 }, { year: 1403, month: 5, day: 12 }),
    ).toBe(true)
    expect(
      isJalaliInRange(
        { year: 1403, month: 5, day: 12 },
        { year: 1403, month: 5, day: 1 },
        { year: 1403, month: 5, day: 31 },
      ),
    ).toBe(true)
  })
})
