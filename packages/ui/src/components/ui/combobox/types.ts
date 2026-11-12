export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
  /** نام گروه؛ گزینه‌های هم‌گروه زیر یک برچسب نمایش داده می‌شوند. */
  group?: string
}
