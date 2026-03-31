<script setup lang="ts">
import { Example } from "@/components"
import { Button } from "@/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/ui/hover-card"
</script>

<template>
  <Example title="In Dialog">
    <Dialog>
      <DialogTrigger :as-child="true">
        <Button variant="outline">
          Open Dialog
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hover Card Example</DialogTitle>
          <DialogDescription>
            Hover over the button below to see the hover card.
          </DialogDescription>
        </DialogHeader>
        <HoverCard :open-delay="100" :close-delay="100">
          <HoverCardTrigger :as-child="true">
            <Button variant="outline" class="w-fit">
              Hover me
            </Button>
          </HoverCardTrigger>
          <HoverCardContent class="w-64">
            <div class="style-lyra:gap-1 style-nova:gap-1.5 style-vega:gap-2 style-maia:gap-2 style-mira:gap-1 flex flex-col">
              <h4 class="font-medium">
                Hover Card
              </h4>
              <p>
                This hover card appears inside a dialog. Hover over the button
                to see it.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </DialogContent>
    </Dialog>
  </Example>
</template>
