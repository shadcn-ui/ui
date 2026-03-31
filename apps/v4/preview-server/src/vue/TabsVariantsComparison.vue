<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs"
</script>

<template>
  <div class="flex gap-4">
    <Tabs default-value="overview">
      <TabsList>
        <TabsTrigger value="overview">
          Overview
        </TabsTrigger>
        <TabsTrigger value="analytics">
          Analytics
        </TabsTrigger>
      </TabsList>
    </Tabs>
    <Tabs default-value="overview">
      <TabsList variant="line">
        <TabsTrigger value="overview">
          Overview
        </TabsTrigger>
        <TabsTrigger value="analytics">
          Analytics
        </TabsTrigger>
      </TabsList>
    </Tabs>
  </div>
</template>
