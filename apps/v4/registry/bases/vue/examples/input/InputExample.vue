<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components/example"
import InputBasic from "@/examples/input/InputBasic.vue"
import InputDisabled from "@/examples/input/InputDisabled.vue"
import InputForm from "@/examples/input/InputForm.vue"
import InputInvalid from "@/examples/input/InputInvalid.vue"
import InputTypes from "@/examples/input/InputTypes.vue"
import InputWithButton from "@/examples/input/InputWithButton.vue"
import InputWithDescription from "@/examples/input/InputWithDescription.vue"
import InputWithLabel from "@/examples/input/InputWithLabel.vue"
import InputWithNativeSelect from "@/examples/input/InputWithNativeSelect.vue"
import InputWithSelect from "@/examples/input/InputWithSelect.vue"
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
