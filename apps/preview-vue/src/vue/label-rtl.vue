<script setup lang="ts">
import { Checkbox } from '@/ui/checkbox'
import { Label } from '@/ui/label'
</script>

<template>
  <div class="flex gap-2" dir="rtl">
    <Checkbox id="terms-rtl" />
    <Label for="terms-rtl">قبول الشروط والأحكام</Label>
  </div>
</template>
