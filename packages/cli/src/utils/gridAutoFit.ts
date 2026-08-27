/**
 * shadcn-ui/ui - css-grid-autofit-calculator
 */
export function makeGridColumns(minWidthPx: number): string { return `repeat(auto-fit, minmax(${minWidthPx}px, 1fr))`; }
