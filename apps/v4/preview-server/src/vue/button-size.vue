<script setup lang="ts">
  import Button from "@/ui/button.vue"
</script>

<template>
  <div class="flex flex-col items-start gap-8 sm:flex-row">
    <div class="flex items-start gap-2">
      <Button size="xs" variant="outline">Extra Small</Button>
      <Button size="icon-xs" aria-label="Submit" variant="outline">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
      </Button>
    </div>
    <div class="flex items-start gap-2">
      <Button size="sm" variant="outline">Small</Button>
      <Button size="icon-sm" aria-label="Submit" variant="outline">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
      </Button>
    </div>
    <div class="flex items-start gap-2">
      <Button variant="outline">Default</Button>
      <Button size="icon" aria-label="Submit" variant="outline">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
      </Button>
    </div>
    <div class="flex items-start gap-2">
      <Button variant="outline" size="lg">Large</Button>
      <Button size="icon-lg" aria-label="Submit" variant="outline">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
      </Button>
    </div>
  </div>
</template>
