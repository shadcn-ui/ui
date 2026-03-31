<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components"
import InputBasic from "./InputBasic.vue"
import InputDisabled from "./InputDisabled.vue"
import InputForm from "./InputForm.vue"
import InputInvalid from "./InputInvalid.vue"
import InputTypes from "./InputTypes.vue"
import InputWithButton from "./InputWithButton.vue"
import InputWithDescription from "./InputWithDescription.vue"
import InputWithLabel from "./InputWithLabel.vue"
import InputWithNativeSelect from "./InputWithNativeSelect.vue"
import InputWithSelect from "./InputWithSelect.vue"
</script>

<template>
  <ExampleWrapper>
    <Example title="Basic">
      <InputBasic />
    </Example>
    <Example title="Invalid">
      <InputInvalid />
    </Example>
    <Example title="With Label">
      <InputWithLabel />
    </Example>
    <Example title="With Description">
      <InputWithDescription />
    </Example>
    <Example title="Disabled">
      <InputDisabled />
    </Example>
    <Example title="Input Types">
      <InputTypes />
    </Example>
    <Example title="With Select">
      <InputWithSelect />
    </Example>
    <Example title="With Button">
      <InputWithButton />
    </Example>
    <Example title="With Native Select">
      <InputWithNativeSelect />
    </Example>
    <Example title="Form">
      <InputForm />
    </Example>
  </ExampleWrapper>
</template>
