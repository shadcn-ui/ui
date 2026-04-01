import { Avatar, AvatarFallback, AvatarImage } from '@/ember-ui/avatar';
import { Button } from '@/ember-ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/ember-ui/empty';

import Plus from '~icons/lucide/plus';

<template>
  {{! template-lint-disable no-potential-path-strings }}
  <Empty @class="flex-none border">
    <EmptyHeader>
      <EmptyMedia>
        <div
          class="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale"
        >
          <Avatar>
            <AvatarImage @alt="@shadcn" @src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              @alt="@maxleiter"
              @src="https://github.com/maxleiter.png"
            />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              @alt="@evilrabbit"
              @src="https://github.com/evilrabbit.png"
            />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </div>
      </EmptyMedia>
      <EmptyTitle>No Team Members</EmptyTitle>
      <EmptyDescription>
        Invite your team to collaborate on this project.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button @size="sm">
        <Plus />
        Invite Members
      </Button>
    </EmptyContent>
  </Empty>
</template>
