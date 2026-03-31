<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import BreadcrumbBasic from "./BreadcrumbBasic.vue"
import BreadcrumbWithDropdown from "./BreadcrumbWithDropdown.vue"
import BreadcrumbWithLink from "./BreadcrumbWithLink.vue"
</script>

<template>
  <ExampleWrapper>
    <BreadcrumbBasic />
    <BreadcrumbWithDropdown />
    <BreadcrumbWithLink />
  </ExampleWrapper>
</template>
