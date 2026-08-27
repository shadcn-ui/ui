/**
 * shadcn-ui/ui - combobox-keyboard-nav
 */
export function handleComboboxKey(e: any, index: number, total: number): number { return (index + 1) % total; }
