<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components"
import SelectBasic from "./SelectBasic.vue"
import SelectDisabled from "./SelectDisabled.vue"
import SelectInDialog from "./SelectInDialog.vue"
import SelectInline from "./SelectInline.vue"
import SelectInvalid from "./SelectInvalid.vue"
import SelectLargeList from "./SelectLargeList.vue"
import SelectPlan from "./SelectPlan.vue"
import SelectPopper from "./SelectPopper.vue"
import SelectSizes from "./SelectSizes.vue"
import SelectWithButton from "./SelectWithButton.vue"
import SelectWithField from "./SelectWithField.vue"
import SelectWithGroups from "./SelectWithGroups.vue"
import SelectWithIcons from "./SelectWithIcons.vue"
</script>

<template>
  <ExampleWrapper>
    <Example title="Basic">
      <SelectBasic />
    </Example>
    <Example title="With Icons">
      <SelectWithIcons />
    </Example>
    <Example title="With Groups & Labels">
      <SelectWithGroups />
    </Example>
    <Example title="Large List">
      <SelectLargeList />
    </Example>
    <Example title="Sizes">
      <SelectSizes />
    </Example>
    <Example title="With Button">
      <SelectWithButton />
    </Example>
    <Example title="Popper">
      <SelectPopper />
    </Example>
    <Example title="With Field">
      <SelectWithField />
    </Example>
    <Example title="Invalid">
      <SelectInvalid />
    </Example>
    <Example title="Inline with Input & NativeSelect">
      <SelectInline />
    </Example>
    <Example title="Disabled">
      <SelectDisabled />
    </Example>
    <Example title="Subscription Plan">
      <SelectPlan />
    </Example>
    <Example title="In Dialog">
      <SelectInDialog />
    </Example>
  </ExampleWrapper>
</template>
