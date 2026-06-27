import { Tabs, TabsList, TabsTrigger } from '@/ember-ui/tabs';

<template>
  <Tabs @defaultValue="home">
    <TabsList>
      <TabsTrigger @value="home">Home</TabsTrigger>
      <TabsTrigger @value="settings" disabled>Disabled</TabsTrigger>
    </TabsList>
  </Tabs>
</template>
