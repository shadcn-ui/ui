<script setup lang="ts">
import { NavigationMenuLink } from '@/ui/navigation-menu'

defineProps<{
  to: string
  title: string
}>()
</script>

<template>
  <li>
    <NavigationMenuLink as-child>
      <a :href="to">
        <div class="text-sm leading-none font-medium">
          {{ title }}
        </div>
        <p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
          <slot />
        </p>
      </a>
    </NavigationMenuLink>
  </li>
</template>
