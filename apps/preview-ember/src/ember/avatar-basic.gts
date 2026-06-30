import { Avatar, AvatarFallback, AvatarImage } from '@/ember-ui/avatar';

<template>
  <Avatar>
    <AvatarImage
      @src="https://github.com/shadcn.png"
      @alt="@shadcn"
      @class="grayscale"
    />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
</template>
