<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import ButtonGroupBasic from "@/examples/button-group/ButtonGroupBasic.vue"
import ButtonGroupNavigation from "@/examples/button-group/ButtonGroupNavigation.vue"
import ButtonGroupNested from "@/examples/button-group/ButtonGroupNested.vue"
import ButtonGroupPagination from "@/examples/button-group/ButtonGroupPagination.vue"
import ButtonGroupPaginationSplit from "@/examples/button-group/ButtonGroupPaginationSplit.vue"
import ButtonGroupTextAlignment from "@/examples/button-group/ButtonGroupTextAlignment.vue"
import ButtonGroupVertical from "@/examples/button-group/ButtonGroupVertical.vue"
import ButtonGroupVerticalNested from "@/examples/button-group/ButtonGroupVerticalNested.vue"
import ButtonGroupWithDropdown from "@/examples/button-group/ButtonGroupWithDropdown.vue"
import ButtonGroupWithFields from "@/examples/button-group/ButtonGroupWithFields.vue"
import ButtonGroupWithIcons from "@/examples/button-group/ButtonGroupWithIcons.vue"
import ButtonGroupWithInput from "@/examples/button-group/ButtonGroupWithInput.vue"
import ButtonGroupWithInputGroup from "@/examples/button-group/ButtonGroupWithInputGroup.vue"
import ButtonGroupWithLike from "@/examples/button-group/ButtonGroupWithLike.vue"
import ButtonGroupWithSelect from "@/examples/button-group/ButtonGroupWithSelect.vue"
import ButtonGroupWithSelectAndInput from "@/examples/button-group/ButtonGroupWithSelectAndInput.vue"
import ButtonGroupWithText from "@/examples/button-group/ButtonGroupWithText.vue"
</script>

<template>
  <ExampleWrapper>
    <ButtonGroupBasic />
    <ButtonGroupWithInput />
    <ButtonGroupWithText />
    <ButtonGroupWithDropdown />
    <ButtonGroupWithSelect />
    <ButtonGroupWithIcons />
    <ButtonGroupWithInputGroup />
    <ButtonGroupWithFields />
    <ButtonGroupWithLike />
    <ButtonGroupWithSelectAndInput />
    <ButtonGroupNested />
    <ButtonGroupPagination />
    <ButtonGroupPaginationSplit />
    <ButtonGroupNavigation />
    <ButtonGroupTextAlignment />
    <ButtonGroupVertical />
    <ButtonGroupVerticalNested />
  </ExampleWrapper>
</template>
