<script setup lang="ts">
import ChevronDownIcon from "@material-symbols/svg-400/rounded/keyboard_arrow_down.svg?component"
import { Button } from '@/ui/button'
import { Card, CardContent } from '@/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/collapsible'
</script>

<template>
  <Card class="mx-auto w-full max-w-sm">
    <CardContent>
      <Collapsible class="rounded-md data-[state=open]:bg-muted">
        <CollapsibleTrigger as-child>
          <Button variant="ghost" class="group w-full">
            Product details
            <ChevronDownIcon class="ml-auto group-data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent class="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
          <div>
            This panel can be expanded or collapsed to reveal additional
            content.
          </div>
          <Button size="xs">Learn More</Button>
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  </Card>
</template>
