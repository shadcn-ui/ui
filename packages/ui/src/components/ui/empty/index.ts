import { createPrimitive } from '../../../lib/createPrimitive'

export const Empty = createPrimitive(
  'Empty',
  'section',
  'flex min-h-48 w-full flex-col items-center justify-center gap-6 rounded-lg p-6 text-center',
)
export const EmptyHeader = createPrimitive(
  'EmptyHeader',
  'div',
  'mx-auto flex max-w-sm flex-col items-center gap-2 text-center',
)
export const EmptyMedia = createPrimitive(
  'EmptyMedia',
  'div',
  'flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground [&>svg]:size-6',
)
export const EmptyTitle = createPrimitive(
  'EmptyTitle',
  'h3',
  'text-base font-semibold',
)
export const EmptyDescription = createPrimitive(
  'EmptyDescription',
  'p',
  'text-sm text-muted-foreground',
)
export const EmptyContent = createPrimitive(
  'EmptyContent',
  'div',
  'flex w-full max-w-sm flex-col items-center gap-3',
)
