import { createPrimitive } from '../../../lib/createPrimitive'

export const Kbd = createPrimitive(
  'Kbd',
  'kbd',
  'inline-flex min-h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground shadow-sm',
)
export const KbdGroup = createPrimitive('KbdGroup', 'span', 'inline-flex items-center gap-1')
