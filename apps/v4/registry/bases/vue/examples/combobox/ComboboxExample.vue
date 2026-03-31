<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import ComboboxAutoHighlight from "@/examples/combobox/ComboboxAutoHighlight.vue"
import ComboboxBasic from "@/examples/combobox/ComboboxBasic.vue"
import ComboboxDisabled from "@/examples/combobox/ComboboxDisabled.vue"
import ComboboxInDialog from "@/examples/combobox/ComboboxInDialog.vue"
import ComboboxInPopup from "@/examples/combobox/ComboboxInPopup.vue"
import ComboboxInputAddon from "@/examples/combobox/ComboboxInputAddon.vue"
import ComboboxInvalid from "@/examples/combobox/ComboboxInvalid.vue"
import ComboboxLargeList from "@/examples/combobox/ComboboxLargeList.vue"
import ComboboxWithClear from "@/examples/combobox/ComboboxWithClear.vue"
import ComboboxWithForm from "@/examples/combobox/ComboboxWithForm.vue"
import ComboboxWithGroups from "@/examples/combobox/ComboboxWithGroups.vue"
import ComboboxWithGroupsAndSeparator from "@/examples/combobox/ComboboxWithGroupsAndSeparator.vue"
import ComboboxWithOtherInputs from "@/examples/combobox/ComboboxWithOtherInputs.vue"
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
