<script setup lang="ts">
import PlusIcon from '@material-symbols/svg-400/rounded/add.svg?component'
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from '@/ui/avatar'
</script>

<template>
  <Avatar class="grayscale">
    <AvatarImage src="https://github.com/pranathip.png" alt="@pranathip" />
    <AvatarFallback>PP</AvatarFallback>
    <AvatarBadge>
      <PlusIcon />
    </AvatarBadge>
  </Avatar>
</template>
