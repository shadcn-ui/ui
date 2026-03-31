<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import CardDefault from "./CardDefault.vue"
import CardFooterWithBorder from "./CardFooterWithBorder.vue"
import CardFooterWithBorderSmall from "./CardFooterWithBorderSmall.vue"
import CardHeaderWithBorder from "./CardHeaderWithBorder.vue"
import CardHeaderWithBorderSmall from "./CardHeaderWithBorderSmall.vue"
import CardLogin from "./CardLogin.vue"
import CardMeetingNotes from "./CardMeetingNotes.vue"
import CardSmall from "./CardSmall.vue"
import CardWithImage from "./CardWithImage.vue"
import CardWithImageSmall from "./CardWithImageSmall.vue"
</script>

<template>
  <ExampleWrapper>
    <CardDefault />
    <CardSmall />
    <CardHeaderWithBorder />
    <CardFooterWithBorder />
    <CardHeaderWithBorderSmall />
    <CardFooterWithBorderSmall />
    <CardWithImage />
    <CardWithImageSmall />
    <CardLogin />
    <CardMeetingNotes />
  </ExampleWrapper>
</template>
