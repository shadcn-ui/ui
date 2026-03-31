<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select"
</script>

<template>
  <div class="flex flex-col gap-4">
    <Select>
      <SelectTrigger size="sm">
        <SelectValue>
          <template #placeholder>
            <IconPlaceholder
              lucide="ChartLineIcon"
              tabler="IconChartLine"
              hugeicons="Chart03Icon"
              phosphor="ChartLineIcon"
              remixicon="RiLineChartLine"
            />
            Chart Type
          </template>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="line">
            <IconPlaceholder
              lucide="ChartLineIcon"
              tabler="IconChartLine"
              hugeicons="Chart03Icon"
              phosphor="ChartLineIcon"
              remixicon="RiLineChartLine"
            />
            Line
          </SelectItem>
          <SelectItem value="bar">
            <IconPlaceholder
              lucide="ChartBarIcon"
              tabler="IconChartBar"
              hugeicons="Chart03Icon"
              phosphor="ChartBarIcon"
              remixicon="RiBarChartLine"
            />
            Bar
          </SelectItem>
          <SelectItem value="pie">
            <IconPlaceholder
              lucide="ChartPieIcon"
              tabler="IconChartPie"
              hugeicons="Chart03Icon"
              phosphor="ChartPieIcon"
              remixicon="RiPieChartLine"
            />
            Pie
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <Select>
      <SelectTrigger size="default">
        <SelectValue>
          <template #placeholder>
            <IconPlaceholder
              lucide="ChartLineIcon"
              tabler="IconChartLine"
              hugeicons="Chart03Icon"
              phosphor="ChartLineIcon"
              remixicon="RiLineChartLine"
            />
            Chart Type
          </template>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="line">
            <IconPlaceholder
              lucide="ChartLineIcon"
              tabler="IconChartLine"
              hugeicons="Chart03Icon"
              phosphor="ChartLineIcon"
              remixicon="RiLineChartLine"
            />
            Line
          </SelectItem>
          <SelectItem value="bar">
            <IconPlaceholder
              lucide="ChartBarIcon"
              tabler="IconChartBar"
              hugeicons="Chart03Icon"
              phosphor="ChartBarIcon"
              remixicon="RiBarChartLine"
            />
            Bar
          </SelectItem>
          <SelectItem value="pie">
            <IconPlaceholder
              lucide="ChartPieIcon"
              tabler="IconChartPie"
              hugeicons="Chart03Icon"
              phosphor="ChartPieIcon"
              remixicon="RiPieChartLine"
            />
            Pie
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>
