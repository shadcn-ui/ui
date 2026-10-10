'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useIsMobile } from '@/hooks/use-mobile'
import { IconPlaceholder } from '@/app/(create)/components/icon-placeholder'
import type { Item } from '@/registry/acme/lib/types'

export * from '@/registry/acme/lib/types'

const actionVariants = cva('inline-flex items-center gap-2 pl-2 text-left', {
  variants: {
    size: {
      sm: 'h-8 pr-2',
      lg: 'h-10 pr-4 ml-auto',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})

const LazyChart = React.lazy(() => import('@/components/chart'))

export function CardActions({
  items,
  side = 'right',
  className,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof actionVariants> & {
    items: Item[]
    side?: 'left' | 'right'
  }) {
  const isMobile = useIsMobile()

  return (
    <div
      className={cn(actionVariants({ size: isMobile ? 'sm' : 'lg' }), className)}
      {...props}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='ml-2 rounded-l-md'>
            <IconPlaceholder
              lucide='MoreHorizontalIcon'
              tabler='IconDots'
              hugeicons='MoreHorizontalCircle01Icon'
              phosphor='DotsThreeIcon'
              remixicon='RiMoreLine'
              className='cn-rtl-flip size-4'
            />
            <span className='sr-only'>More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={side}
          align='start'
          className={cn(
            'cn-menu-target cn-menu-translucent w-56',
            isMobile && 'right-0 left-auto'
          )}
        >
          {items.map((item) => (
            <DropdownMenuItem key={item.id} asChild>
              <a
                href={item.href}
                className={`flex pl-2 ${item.active ? 'font-medium' : ''}`}
              >
                <span className='cn-font-heading truncate'>{item.title}</span>
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <React.Suspense fallback={null}>
        <LazyChart />
      </React.Suspense>
      <Button asChild variant='link' size='sm'>
        <a href='/docs' className='ml-auto'>
          Docs
        </a>
      </Button>
    </div>
  )
}
