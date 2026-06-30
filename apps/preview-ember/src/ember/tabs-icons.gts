import { Tabs, TabsList, TabsTrigger } from '@/ember-ui/tabs';
import AppWindowIcon from '~icons/ms/web_asset';
import CodeIcon from '~icons/ms/code';

<template>
  <Tabs @defaultValue="preview">
    <TabsList>
      <TabsTrigger @value="preview">
        <AppWindowIcon />
        Preview
      </TabsTrigger>
      <TabsTrigger @value="code">
        <CodeIcon />
        Code
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>
