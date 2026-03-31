<script setup lang="ts">
import { CalendarDate } from "@internationalized/date"
import { ref } from "vue"
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Calendar } from "@/ui/calendar"
import { Card, CardContent, CardFooter } from "@/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/ui/input-group"
import { Example } from "@/components"

const date = ref<CalendarDate>(
  new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    12,
  ),
)
</script>

<template>
  <Example title="With Time">
    <Card size="sm" class="mx-auto w-fit">
      <CardContent>
        <Calendar
          v-model="date"
          class="p-0"
        />
      </CardContent>
      <CardFooter class="bg-card border-t">
        <FieldGroup>
          <Field>
            <FieldLabel html-for="time-from">
              Start Time
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="time-from"
                type="time"
                step="1"
                default-value="10:30:00"
                class="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <IconPlaceholder
                  lucide="Clock2Icon"
                  tabler="IconClockHour2"
                  hugeicons="Clock03Icon"
                  phosphor="ClockIcon"
                  remixicon="RiTimeLine"
                  class="text-muted-foreground"
                />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel html-for="time-to">
              End Time
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="time-to"
                type="time"
                step="1"
                default-value="12:30:00"
                class="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <IconPlaceholder
                  lucide="Clock2Icon"
                  tabler="IconClockHour2"
                  hugeicons="Clock03Icon"
                  phosphor="ClockIcon"
                  remixicon="RiTimeLine"
                  class="text-muted-foreground"
                />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
  </Example>
</template>
