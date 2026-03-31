<script setup lang="ts">
import { ref } from "vue"
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Button } from "@/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/ui/collapsible"
import { Field, FieldGroup, FieldLabel } from "@/ui/field"
import { Input } from "@/ui/input"
import { Example } from "@/components/example"

const isOpen = ref(false)
</script>

<template>
  <Example title="Settings" class="items-center">
    <Card class="mx-auto w-full max-w-xs" size="sm">
      <CardHeader>
        <CardTitle>Radius</CardTitle>
        <CardDescription>
          Set the corner radius of the element.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible
          v-model:open="isOpen"
          class="flex items-start gap-2"
        >
          <FieldGroup class="grid w-full grid-cols-2 gap-2">
            <Field>
              <FieldLabel html-for="radius-x" class="sr-only">
                Radius X
              </FieldLabel>
              <Input id="radius" placeholder="0" :default-value="0" />
            </Field>
            <Field>
              <FieldLabel html-for="radius-y" class="sr-only">
                Radius Y
              </FieldLabel>
              <Input id="radius" placeholder="0" :default-value="0" />
            </Field>
            <CollapsibleContent class="col-span-full grid grid-cols-subgrid gap-2">
              <Field>
                <FieldLabel html-for="radius-x" class="sr-only">
                  Radius X
                </FieldLabel>
                <Input id="radius" placeholder="0" :default-value="0" />
              </Field>
              <Field>
                <FieldLabel html-for="radius-y" class="sr-only">
                  Radius Y
                </FieldLabel>
                <Input id="radius" placeholder="0" :default-value="0" />
              </Field>
            </CollapsibleContent>
          </FieldGroup>
          <CollapsibleTrigger :as-child="true">
            <Button variant="outline" size="icon">
              <IconPlaceholder
                v-if="isOpen"
                lucide="MinimizeIcon"
                tabler="IconMinimize"
                hugeicons="MinusSignIcon"
                phosphor="ArrowsInIcon"
                remixicon="RiContractLine"
              />
              <IconPlaceholder
                v-else
                lucide="MaximizeIcon"
                tabler="IconMaximize"
                hugeicons="PlusSignIcon"
                phosphor="ArrowsOutIcon"
                remixicon="RiExpandLine"
              />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </CardContent>
    </Card>
  </Example>
</template>
