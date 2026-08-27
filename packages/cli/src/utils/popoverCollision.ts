/**
 * shadcn-ui/ui - popover-collision-boundary-avoider
 */
export function avoidCollision(pos: number, size: number, windowSize: number): number { return (pos + size > windowSize) ? windowSize - size : pos; }
