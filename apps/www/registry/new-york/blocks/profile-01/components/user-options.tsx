import { Button } from '@/registry/new-york/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,  DropdownMenuTrigger } from '@/registry/new-york/ui/dropdown-menu';
import { Ban, Ellipsis, OctagonAlert, Share,  } from 'lucide-react';
import type { JSX } from 'react'

export default function UserOptions (): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button   size="icon" variant='ghost' className='ml-auto text-foreground/80'>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className='flex cursor-pointer items-center gap-2'>
          <Share />
          Share to
        </DropdownMenuItem>
        <DropdownMenuItem className='flex cursor-pointer items-center gap-2 text-destructive'>
          <Ban />
          Block
        </DropdownMenuItem>
        <DropdownMenuItem className='flex cursor-pointer items-center gap-2 text-destructive'>
          <OctagonAlert />
          Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

