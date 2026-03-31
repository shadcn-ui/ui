<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components"
import ToggleGroupBasic from "./ToggleGroupBasic.vue"
import ToggleGroupDateRange from "./ToggleGroupDateRange.vue"
import ToggleGroupFilter from "./ToggleGroupFilter.vue"
import ToggleGroupOutline from "./ToggleGroupOutline.vue"
import ToggleGroupOutlineWithIcons from "./ToggleGroupOutlineWithIcons.vue"
import ToggleGroupSizes from "./ToggleGroupSizes.vue"
import ToggleGroupSort from "./ToggleGroupSort.vue"
import ToggleGroupSpacing from "./ToggleGroupSpacing.vue"
import ToggleGroupVertical from "./ToggleGroupVertical.vue"
import ToggleGroupVerticalOutline from "./ToggleGroupVerticalOutline.vue"
import ToggleGroupVerticalOutlineWithIcons from "./ToggleGroupVerticalOutlineWithIcons.vue"
import ToggleGroupVerticalWithSpacing from "./ToggleGroupVerticalWithSpacing.vue"
import ToggleGroupWithIcons from "./ToggleGroupWithIcons.vue"
import ToggleGroupWithInputAndSelect from "./ToggleGroupWithInputAndSelect.vue"
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
