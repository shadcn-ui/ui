/**
 * shadcn-ui/ui - tooltip-hover-intent-detector
 */
export function isHoverIntent(velocity: number): boolean { return velocity < 0.1; }
