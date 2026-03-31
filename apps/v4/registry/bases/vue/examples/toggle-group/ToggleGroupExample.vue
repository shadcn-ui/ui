<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components/example"
import ToggleGroupBasic from "@/examples/toggle-group/ToggleGroupBasic.vue"
import ToggleGroupDateRange from "@/examples/toggle-group/ToggleGroupDateRange.vue"
import ToggleGroupFilter from "@/examples/toggle-group/ToggleGroupFilter.vue"
import ToggleGroupOutline from "@/examples/toggle-group/ToggleGroupOutline.vue"
import ToggleGroupOutlineWithIcons from "@/examples/toggle-group/ToggleGroupOutlineWithIcons.vue"
import ToggleGroupSizes from "@/examples/toggle-group/ToggleGroupSizes.vue"
import ToggleGroupSort from "@/examples/toggle-group/ToggleGroupSort.vue"
import ToggleGroupSpacing from "@/examples/toggle-group/ToggleGroupSpacing.vue"
import ToggleGroupVertical from "@/examples/toggle-group/ToggleGroupVertical.vue"
import ToggleGroupVerticalOutline from "@/examples/toggle-group/ToggleGroupVerticalOutline.vue"
import ToggleGroupVerticalOutlineWithIcons from "@/examples/toggle-group/ToggleGroupVerticalOutlineWithIcons.vue"
import ToggleGroupVerticalWithSpacing from "@/examples/toggle-group/ToggleGroupVerticalWithSpacing.vue"
import ToggleGroupWithIcons from "@/examples/toggle-group/ToggleGroupWithIcons.vue"
import ToggleGroupWithInputAndSelect from "@/examples/toggle-group/ToggleGroupWithInputAndSelect.vue"
</script>

<template>
  <ExampleWrapper>
    <Example title="Basic">
      <ToggleGroupBasic />
    </Example>
    <Example title="Outline">
      <ToggleGroupOutline />
    </Example>
    <Example title="Outline With Icons">
      <ToggleGroupOutlineWithIcons />
    </Example>
    <Example title="Sizes">
      <ToggleGroupSizes />
    </Example>
    <Example title="With Spacing">
      <ToggleGroupSpacing />
    </Example>
    <Example title="With Icons">
      <ToggleGroupWithIcons />
    </Example>
    <Example title="Filter">
      <ToggleGroupFilter />
    </Example>
    <Example title="Date Range">
      <ToggleGroupDateRange />
    </Example>
    <Example title="Sort">
      <ToggleGroupSort />
    </Example>
    <Example title="With Input and Select">
      <ToggleGroupWithInputAndSelect />
    </Example>
    <Example title="Vertical">
      <ToggleGroupVertical />
    </Example>
    <Example title="Vertical Outline">
      <ToggleGroupVerticalOutline />
    </Example>
    <Example title="Vertical Outline With Icons">
      <ToggleGroupVerticalOutlineWithIcons />
    </Example>
    <Example title="Vertical With Spacing">
      <ToggleGroupVerticalWithSpacing />
    </Example>
  </ExampleWrapper>
</template>
