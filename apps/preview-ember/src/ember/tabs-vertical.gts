import { Tabs, TabsList, TabsTrigger } from '@/ember-ui/tabs';

<template>
  <Tabs @defaultValue="account" @orientation="vertical">
    <TabsList>
      <TabsTrigger @value="account">Account</TabsTrigger>
      <TabsTrigger @value="password">Password</TabsTrigger>
      <TabsTrigger @value="notifications">Notifications</TabsTrigger>
    </TabsList>
  </Tabs>
</template>
