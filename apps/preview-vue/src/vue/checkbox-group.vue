<script setup lang="ts">
import { Checkbox } from '@/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/ui/field'
</script>

<template>
  <FieldSet>
    <FieldLegend variant="label">
      Show these items on the desktop:
    </FieldLegend>
    <FieldDescription>
      Select the items you want to show on the desktop.
    </FieldDescription>
    <FieldGroup class="gap-3">
      <Field orientation="horizontal">
        <Checkbox
          id="finder-pref-9k2-hard-disks-ljj-checkbox"
          name="finder-pref-9k2-hard-disks-ljj-checkbox"
          :default-value="true"
        />
        <FieldLabel
          for="finder-pref-9k2-hard-disks-ljj-checkbox"
          class="font-normal"
        >
          Hard disks
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox
          id="finder-pref-9k2-external-disks-1yg-checkbox"
          name="finder-pref-9k2-external-disks-1yg-checkbox"
          :default-value="true"
        />
        <FieldLabel
          for="finder-pref-9k2-external-disks-1yg-checkbox"
          class="font-normal"
        >
          External disks
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox
          id="finder-pref-9k2-cds-dvds-fzt-checkbox"
          name="finder-pref-9k2-cds-dvds-fzt-checkbox"
        />
        <FieldLabel
          for="finder-pref-9k2-cds-dvds-fzt-checkbox"
          class="font-normal"
        >
          CDs, DVDs, and iPods
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox
          id="finder-pref-9k2-connected-servers-6l2-checkbox"
          name="finder-pref-9k2-connected-servers-6l2-checkbox"
        />
        <FieldLabel
          for="finder-pref-9k2-connected-servers-6l2-checkbox"
          class="font-normal"
        >
          Connected servers
        </FieldLabel>
      </Field>
    </FieldGroup>
  </FieldSet>
</template>
