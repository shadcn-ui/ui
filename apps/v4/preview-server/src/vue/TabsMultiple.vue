<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs"
</script>

<template>
  <Tabs default-value="overview">
    <TabsList>
      <TabsTrigger value="overview">
        Overview
      </TabsTrigger>
      <TabsTrigger value="analytics">
        Analytics
      </TabsTrigger>
      <TabsTrigger value="reports">
        Reports
      </TabsTrigger>
      <TabsTrigger value="settings">
        Settings
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>
