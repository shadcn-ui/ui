<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import ComboboxAutoHighlight from "./ComboboxAutoHighlight.vue"
import ComboboxBasic from "./ComboboxBasic.vue"
import ComboboxDisabled from "./ComboboxDisabled.vue"
import ComboboxInDialog from "./ComboboxInDialog.vue"
import ComboboxInPopup from "./ComboboxInPopup.vue"
import ComboboxInputAddon from "./ComboboxInputAddon.vue"
import ComboboxInvalid from "./ComboboxInvalid.vue"
import ComboboxLargeList from "./ComboboxLargeList.vue"
import ComboboxWithClear from "./ComboboxWithClear.vue"
import ComboboxWithForm from "./ComboboxWithForm.vue"
import ComboboxWithGroups from "./ComboboxWithGroups.vue"
import ComboboxWithGroupsAndSeparator from "./ComboboxWithGroupsAndSeparator.vue"
import ComboboxWithOtherInputs from "./ComboboxWithOtherInputs.vue"
</script>

<template>
  <ExampleWrapper>
    <ComboboxBasic />
    <ComboboxDisabled />
    <ComboboxInvalid />
    <ComboboxWithClear />
    <ComboboxAutoHighlight />
    <ComboboxWithGroups />
    <ComboboxWithGroupsAndSeparator />
    <ComboboxLargeList />
    <ComboboxInputAddon />
    <ComboboxInPopup />
    <ComboboxWithForm />
    <ComboboxInDialog />
    <ComboboxWithOtherInputs />
  </ExampleWrapper>
</template>
