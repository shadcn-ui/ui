import { Avatar, AvatarFallback, AvatarImage } from '@/ember-ui/avatar';

<template>
  {{! template-lint-disable no-potential-path-strings }}
  <div class="flex flex-row flex-wrap items-center gap-12">
    <Avatar>
      <AvatarImage @alt="@shadcn" @src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <Avatar @class="rounded-lg">
      <AvatarImage
        @alt="@evilrabbit"
        @src="https://github.com/evilrabbit.png"
      />
      <AvatarFallback>ER</AvatarFallback>
    </Avatar>
    <div
      class="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale"
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
  </div>
</template>
