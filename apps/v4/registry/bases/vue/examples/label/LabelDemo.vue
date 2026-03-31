<script setup lang="ts">
import { Checkbox } from '@/ui/checkbox'
import { Label } from '@/ui/label'
</script>

<template>
  <div class="flex items-center space-x-2">
    <Checkbox id="terms" />
    <Label for="terms">Accept terms and conditions</Label>
  </div>
</template>
