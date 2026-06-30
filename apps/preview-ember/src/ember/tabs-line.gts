import { Tabs, TabsList, TabsTrigger } from '@/ember-ui/tabs';

<template>
  <Tabs @defaultValue="overview">
    <TabsList @variant="line">
      <TabsTrigger @value="overview">Overview</TabsTrigger>
      <TabsTrigger @value="analytics">Analytics</TabsTrigger>
      <TabsTrigger @value="reports">Reports</TabsTrigger>
    </TabsList>
  </Tabs>
</template>
