import { computed, inject, type ComputedRef, type InjectionKey } from 'vue'

export type Direction = 'ltr' | 'rtl'
export type LogicalAlign = 'start' | 'center' | 'end'
export type PhysicalAlign = 'start' | 'center' | 'end'

export const dropdownDirectionKey: InjectionKey<ComputedRef<Direction>> = Symbol(
  'saaze-dropdown-direction',
)

export function useDropdownDirection(): ComputedRef<Direction> {
  return inject(
    dropdownDirectionKey,
    computed(() => 'rtl' as Direction),
  )
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
