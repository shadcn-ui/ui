<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components"
import TabsBasic from "./TabsBasic.vue"
import TabsDisabled from "./TabsDisabled.vue"
import TabsIconOnly from "./TabsIconOnly.vue"
import TabsLine from "./TabsLine.vue"
import TabsLineDisabled from "./TabsLineDisabled.vue"
import TabsLineWithContent from "./TabsLineWithContent.vue"
import TabsMultiple from "./TabsMultiple.vue"
import TabsVariantsComparison from "./TabsVariantsComparison.vue"
import TabsVertical from "./TabsVertical.vue"
import TabsWithContent from "./TabsWithContent.vue"
import TabsWithDropdown from "./TabsWithDropdown.vue"
import TabsWithIcons from "./TabsWithIcons.vue"
import TabsWithInputAndButton from "./TabsWithInputAndButton.vue"
</script>

<template>
  <ExampleWrapper>
    <Example title="Basic">
      <TabsBasic />
    </Example>
    <Example title="Line">
      <TabsLine />
    </Example>
    <Example title="Variants Alignment">
      <TabsVariantsComparison />
    </Example>
    <Example title="Disabled">
      <TabsDisabled />
    </Example>
    <Example title="With Icons">
      <TabsWithIcons />
    </Example>
    <Example title="Icon Only">
      <TabsIconOnly />
    </Example>
    <Example title="Multiple">
      <TabsMultiple />
    </Example>
    <Example title="With Content">
      <TabsWithContent />
    </Example>
    <Example title="Line With Content">
      <TabsLineWithContent />
    </Example>
    <Example title="Line Disabled">
      <TabsLineDisabled />
    </Example>
    <Example title="With Dropdown">
      <TabsWithDropdown />
    </Example>
    <Example title="Vertical">
      <TabsVertical />
    </Example>
    <Example title="With Input and Button" container-class="col-span-full">
      <TabsWithInputAndButton />
    </Example>
  </ExampleWrapper>
</template>
