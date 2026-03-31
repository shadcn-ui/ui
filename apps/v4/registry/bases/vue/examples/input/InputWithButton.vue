<script setup lang="ts">
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
</script>

<template>
  <div class="flex w-full gap-2">
    <Input type="search" placeholder="Search..." class="flex-1" />
    <Button>Search</Button>
  </div>
</template>
