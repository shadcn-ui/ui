<script setup lang="ts">
import MaximizeIcon from "@material-symbols/svg-400/rounded/open_in_full.svg?component"
import MinimizeIcon from "@material-symbols/svg-400/rounded/close_fullscreen.svg?component"
import { ref } from 'vue'
import { Button } from '@/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/collapsible'
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/ui/field'
import { Input } from '@/ui/input'

const isOpen = ref(false)
</script>

<template>
  <Card class="mx-auto w-full max-w-xs" size="sm">
    <CardHeader>
      <CardTitle>Radius</CardTitle>
      <CardDescription>Set the corner radius of the element.</CardDescription>
    </CardHeader>
    <CardContent>
      <Collapsible
        v-model:open="isOpen"
        class="flex items-start gap-2"
      >
        <FieldGroup class="grid w-full grid-cols-2 gap-2">
          <Field>
            <FieldLabel for="radius-x" class="sr-only">Radius X</FieldLabel>
            <Input id="radius-x" placeholder="0" :default-value="0" />
          </Field>
          <Field>
            <FieldLabel for="radius-y" class="sr-only">Radius Y</FieldLabel>
            <Input id="radius-y" placeholder="0" :default-value="0" />
          </Field>
          <CollapsibleContent class="col-span-full grid grid-cols-subgrid gap-2">
            <Field>
              <FieldLabel for="radius-x2" class="sr-only">Radius X</FieldLabel>
              <Input id="radius-x2" placeholder="0" :default-value="0" />
            </Field>
            <Field>
              <FieldLabel for="radius-y2" class="sr-only">Radius Y</FieldLabel>
              <Input id="radius-y2" placeholder="0" :default-value="0" />
            </Field>
          </CollapsibleContent>
        </FieldGroup>
        <CollapsibleTrigger as-child>
          <Button variant="outline" size="icon">
            <MinimizeIcon v-if="isOpen" />
            <MaximizeIcon v-else />
          </Button>
        </CollapsibleTrigger>
      </Collapsible>
    </CardContent>
  </Card>
</template>
