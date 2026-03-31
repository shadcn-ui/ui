<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components/example"
import TabsBasic from "@/examples/tabs/TabsBasic.vue"
import TabsDisabled from "@/examples/tabs/TabsDisabled.vue"
import TabsIconOnly from "@/examples/tabs/TabsIconOnly.vue"
import TabsLine from "@/examples/tabs/TabsLine.vue"
import TabsLineDisabled from "@/examples/tabs/TabsLineDisabled.vue"
import TabsLineWithContent from "@/examples/tabs/TabsLineWithContent.vue"
import TabsMultiple from "@/examples/tabs/TabsMultiple.vue"
import TabsVariantsComparison from "@/examples/tabs/TabsVariantsComparison.vue"
import TabsVertical from "@/examples/tabs/TabsVertical.vue"
import TabsWithContent from "@/examples/tabs/TabsWithContent.vue"
import TabsWithDropdown from "@/examples/tabs/TabsWithDropdown.vue"
import TabsWithIcons from "@/examples/tabs/TabsWithIcons.vue"
import TabsWithInputAndButton from "@/examples/tabs/TabsWithInputAndButton.vue"
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
