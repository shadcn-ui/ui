/**
 * shadcn-ui/ui - dark-mode-luminance-normalizer
 */
export function normalizeLuminance(h: number, s: number, l: number): string { return `hsl(${h} ${s}% ${Math.min(95, l)}%)`; }
