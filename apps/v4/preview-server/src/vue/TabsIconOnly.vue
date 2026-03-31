<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs"
</script>

<template>
  <Tabs default-value="home">
    <TabsList>
      <TabsTrigger value="home">
        <IconPlaceholder
          lucide="HomeIcon"
          tabler="IconHome"
          hugeicons="HomeIcon"
          phosphor="HouseIcon"
          remixicon="RiHomeLine"
        />
      </TabsTrigger>
      <TabsTrigger value="search">
        <IconPlaceholder
          lucide="SearchIcon"
          tabler="IconSearch"
          hugeicons="SearchIcon"
          phosphor="MagnifyingGlassIcon"
          remixicon="RiSearchLine"
        />
      </TabsTrigger>
      <TabsTrigger value="settings">
        <IconPlaceholder
          lucide="SettingsIcon"
          tabler="IconSettings"
          hugeicons="SettingsIcon"
          phosphor="GearIcon"
          remixicon="RiSettings3Line"
        />
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>
