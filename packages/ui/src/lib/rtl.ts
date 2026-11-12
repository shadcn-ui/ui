import {
  computed,
  inject,
  toValue,
  type ComputedRef,
  type InjectionKey,
  type MaybeRefOrGetter,
} from 'vue'

export type Direction = 'ltr' | 'rtl'
export type LogicalAlign = 'start' | 'center' | 'end'
export type PhysicalAlign = 'start' | 'center' | 'end'

/** کلید تزریق جهت فعال؛ `SaazeProvider` و `DirectionProvider` آن را فراهم می‌کنند. */
export const saazeDirectionKey: InjectionKey<ComputedRef<Direction>> = Symbol('saaze-direction')

/**
 * @deprecated منوهای کشویی اکنون از همان `saazeDirectionKey` استفاده می‌کنند.
 * این نام فقط برای سازگاری با نسخه‌های قبلی نگه داشته شده است.
 */
export const dropdownDirectionKey = saazeDirectionKey

/**
 * جهت فعال سازه UI. اگر مؤلفه داخل `SaazeProvider` یا `DirectionProvider` باشد از
 * مقدار آن استفاده می‌شود و در غیر این صورت راست‌به‌چپ فرض می‌شود.
 */
export function useSaazeDirection(): ComputedRef<Direction> {
  return inject(
    saazeDirectionKey,
    computed(() => 'rtl' as Direction),
  )
}

/** @deprecated از `useSaazeDirection` استفاده کنید. */
export const useDropdownDirection = useSaazeDirection

/**
 * جهت نهایی یک مؤلفه: اگر `dir` صریحاً داده شده باشد همان، وگرنه جهت ارائه‌دهنده
 * نزدیک‌ترین والد (و در نبود آن `rtl`).
 */
export function useResolvedDirection(
  dir?: MaybeRefOrGetter<Direction | undefined>,
): ComputedRef<Direction> {
  const inherited = useSaazeDirection()
  return computed(() => toValue(dir) ?? inherited.value)
}

/**
 * Floating UI reads the direction of the floating element and flips the
 * alignment of vertical placements itself. Passing a logical `start` through
 * unchanged therefore aligns the start edge in both RTL and LTR layouts.
 *
 * `direction` is kept in the signature so callers can document which direction
 * a popper belongs to, and so future primitives can opt into manual mapping.
 */
export function resolveLogicalAlign(
  align: LogicalAlign | undefined,
  _direction: Direction,
): PhysicalAlign {
  return align ?? 'center'
}
