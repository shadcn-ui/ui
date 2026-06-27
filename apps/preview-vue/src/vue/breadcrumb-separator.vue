<script setup lang="ts">
import DotIcon from "@material-symbols/svg-400/rounded/block.svg?component"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/ui/breadcrumb'
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink as-child>
          <a href="/">Home</a>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator>
        <DotIcon />
      </BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbLink as-child>
          <a href="/components">Components</a>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator>
        <DotIcon />
      </BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>
