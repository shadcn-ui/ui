<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components/example"
import SelectBasic from "@/examples/select/SelectBasic.vue"
import SelectDisabled from "@/examples/select/SelectDisabled.vue"
import SelectInDialog from "@/examples/select/SelectInDialog.vue"
import SelectInline from "@/examples/select/SelectInline.vue"
import SelectInvalid from "@/examples/select/SelectInvalid.vue"
import SelectLargeList from "@/examples/select/SelectLargeList.vue"
import SelectPlan from "@/examples/select/SelectPlan.vue"
import SelectPopper from "@/examples/select/SelectPopper.vue"
import SelectSizes from "@/examples/select/SelectSizes.vue"
import SelectWithButton from "@/examples/select/SelectWithButton.vue"
import SelectWithField from "@/examples/select/SelectWithField.vue"
import SelectWithGroups from "@/examples/select/SelectWithGroups.vue"
import SelectWithIcons from "@/examples/select/SelectWithIcons.vue"
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
