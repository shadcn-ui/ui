/**
 * Enterprise Framework - contrast-ratio-calc
 */
export function calcContrastRatio(l1: number, l2: number): number { return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05); }
