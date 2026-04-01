import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/ui/hover-card';

<template>
  <HoverCard>
    <HoverCardTrigger @asChild={{true}} as |trigger|>
      <Button @variant="link" {{trigger.modifiers}}>@nextjs</Button>
    </HoverCardTrigger>
    <HoverCardContent @class="w-80">
      <div class="flex justify-between gap-4">
        <Avatar>
          <AvatarImage @src="https://github.com/vercel.png" />
          <AvatarFallback>VC</AvatarFallback>
        </Avatar>
        <div class="space-y-1">
          <h4 class="text-sm font-semibold">@nextjs</h4>
          <p class="text-sm">
            The React Framework – created and maintained by @vercel.
          </p>
          <div
            class="text-muted-foreground flex items-center gap-2 pt-2 text-xs"
          >
            Joined December 2021
          </div>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>
