<script setup lang="ts">
import { toast } from "vue-sonner"
import { Example, ExampleWrapper } from "@/components/example"
import { Button } from "@/ui/button"

function showBasicToast() {
  toast("Event has been created")
}

function showDescriptionToast() {
  toast("Event has been created", {
    description: "Monday, January 3rd at 6:00pm",
  })
}

function showSuccessToast() {
  toast.success("Event has been created")
}

function showErrorToast() {
  toast.error("Something went wrong")
}
</script>

<template>
  <ExampleWrapper>
    <Example title="Basic" class="items-center justify-center">
      <Button
        variant="outline"
        class="w-fit"
        @click="showBasicToast"
      >
        Show Toast
      </Button>
    </Example>

    <Example title="With Description" class="items-center justify-center">
      <Button
        variant="outline"
        class="w-fit"
        @click="showDescriptionToast"
      >
        Show Toast
      </Button>
    </Example>

    <Example title="Success" class="items-center justify-center">
      <Button
        variant="outline"
        class="w-fit"
        @click="showSuccessToast"
      >
        Show Success Toast
      </Button>
    </Example>

    <Example title="Error" class="items-center justify-center">
      <Button
        variant="outline"
        class="w-fit"
        @click="showErrorToast"
      >
        Show Error Toast
      </Button>
    </Example>
  </ExampleWrapper>
</template>
