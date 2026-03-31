<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import CardDefault from "@/examples/card/CardDefault.vue"
import CardFooterWithBorder from "@/examples/card/CardFooterWithBorder.vue"
import CardFooterWithBorderSmall from "@/examples/card/CardFooterWithBorderSmall.vue"
import CardHeaderWithBorder from "@/examples/card/CardHeaderWithBorder.vue"
import CardHeaderWithBorderSmall from "@/examples/card/CardHeaderWithBorderSmall.vue"
import CardLogin from "@/examples/card/CardLogin.vue"
import CardMeetingNotes from "@/examples/card/CardMeetingNotes.vue"
import CardSmall from "@/examples/card/CardSmall.vue"
import CardWithImage from "@/examples/card/CardWithImage.vue"
import CardWithImageSmall from "@/examples/card/CardWithImageSmall.vue"
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
