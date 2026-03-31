<script setup lang="ts">
import { Calendar } from "@/ui/calendar"
import { Card, CardContent } from "@/ui/card"
import { Example } from "@/components"
</script>

<template>
  <Example title="Multiple">
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar type="multiple" />
      </CardContent>
    </Card>
  </Example>
</template>
