<script setup lang="ts">
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/ui/avatar"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="Badge with Icon">
    <div class="flex flex-wrap items-center gap-2">
      <Avatar size="sm">
        <AvatarImage
          src="https://github.com/pranathip.png"
          alt="@pranathip"
        />
        <AvatarFallback>PP</AvatarFallback>
        <AvatarBadge>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </AvatarBadge>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="https://github.com/pranathip.png"
          alt="@pranathip"
        />
        <AvatarFallback>PP</AvatarFallback>
        <AvatarBadge>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </AvatarBadge>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage
          src="https://github.com/pranathip.png"
          alt="@pranathip"
        />
        <AvatarFallback>PP</AvatarFallback>
        <AvatarBadge>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </AvatarBadge>
      </Avatar>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <Avatar size="sm">
        <AvatarFallback>PP</AvatarFallback>
        <AvatarBadge>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </AvatarBadge>
      </Avatar>
      <Avatar>
        <AvatarFallback>PP</AvatarFallback>
        <AvatarBadge>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </AvatarBadge>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>PP</AvatarFallback>
        <AvatarBadge>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </AvatarBadge>
      </Avatar>
    </div>
  </Example>
</template>
