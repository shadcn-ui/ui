<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import ButtonGroupBasic from "./ButtonGroupBasic.vue"
import ButtonGroupNavigation from "./ButtonGroupNavigation.vue"
import ButtonGroupNested from "./ButtonGroupNested.vue"
import ButtonGroupPagination from "./ButtonGroupPagination.vue"
import ButtonGroupPaginationSplit from "./ButtonGroupPaginationSplit.vue"
import ButtonGroupTextAlignment from "./ButtonGroupTextAlignment.vue"
import ButtonGroupVertical from "./ButtonGroupVertical.vue"
import ButtonGroupVerticalNested from "./ButtonGroupVerticalNested.vue"
import ButtonGroupWithDropdown from "./ButtonGroupWithDropdown.vue"
import ButtonGroupWithFields from "./ButtonGroupWithFields.vue"
import ButtonGroupWithIcons from "./ButtonGroupWithIcons.vue"
import ButtonGroupWithInput from "./ButtonGroupWithInput.vue"
import ButtonGroupWithInputGroup from "./ButtonGroupWithInputGroup.vue"
import ButtonGroupWithLike from "./ButtonGroupWithLike.vue"
import ButtonGroupWithSelect from "./ButtonGroupWithSelect.vue"
import ButtonGroupWithSelectAndInput from "./ButtonGroupWithSelectAndInput.vue"
import ButtonGroupWithText from "./ButtonGroupWithText.vue"
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
