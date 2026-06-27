<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from '@/ui/tabs'
</script>

<template>
  <Tabs default-value="account" orientation="vertical">
    <TabsList>
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
      <TabsTrigger value="notifications">Notifications</TabsTrigger>
    </TabsList>
  </Tabs>
</template>
