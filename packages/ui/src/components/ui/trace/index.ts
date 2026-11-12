import { createPrimitive } from '../../../lib/createPrimitive'

export const Trace = createPrimitive('Trace', 'div', 'flex min-w-0 flex-col gap-3')
export const TraceLine = createPrimitive(
  'TraceLine',
  'div',
  'flex min-w-0 items-start gap-3 text-sm',
)
export const TraceIcon = createPrimitive(
  'TraceIcon',
  'span',
  'mt-0.5 inline-flex size-5 shrink-0 items-center justify-center text-muted-foreground [&>svg]:size-4',
  { 'aria-hidden': 'true' },
)
export const TraceTitle = createPrimitive('TraceTitle', 'span', 'min-w-0 flex-1 font-medium')
export const TraceDescription = createPrimitive(
  'TraceDescription',
  'p',
  'mt-1 text-xs text-muted-foreground',
)
export const TraceCollapsible = createPrimitive(
  'TraceCollapsible',
  'details',
  'group min-w-0 rounded-md border border-border',
)
export const TraceCollapsibleTrigger = createPrimitive(
  'TraceCollapsibleTrigger',
  'summary',
  'cursor-pointer list-none p-3 [&::-webkit-details-marker]:hidden',
)
export const TraceCollapsibleContent = createPrimitive(
  'TraceCollapsibleContent',
  'div',
  'border-t border-border p-3 text-sm text-muted-foreground',
)
