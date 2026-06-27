<script setup lang="ts">
import AppWindowIcon from "@material-symbols/svg-400/rounded/web_asset.svg?component"
import CodeIcon from "@material-symbols/svg-400/rounded/code.svg?component"
import { Tabs, TabsList, TabsTrigger } from '@/ui/tabs'
</script>

<template>
  <Tabs default-value="preview">
    <TabsList>
      <TabsTrigger value="preview">
        <AppWindowIcon />
        Preview
      </TabsTrigger>
      <TabsTrigger value="code">
        <CodeIcon />
        Code
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>
