<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs"
</script>

<template>
  <Tabs default-value="home">
    <TabsList>
      <TabsTrigger value="home">
        Home
      </TabsTrigger>
      <TabsTrigger value="settings">
        Settings
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>
