import { Checkbox } from '@/ember-ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/ember-ui/field';

<template>
  <FieldSet>
    <FieldLegend @variant="label">
      Show these items on the desktop:
    </FieldLegend>
    <FieldDescription>
      Select the items you want to show on the desktop.
    </FieldDescription>
    <FieldGroup @class="gap-3">
      <Field @orientation="horizontal">
        <Checkbox
          @checked={{true}}
          id="finder-pref-9k2-hard-disks-ljj-checkbox"
          name="finder-pref-9k2-hard-disks-ljj-checkbox"
        />
        <FieldLabel
          @class="font-normal"
          @for="finder-pref-9k2-hard-disks-ljj-checkbox"
        >
          Hard disks
        </FieldLabel>
      </Field>
      <Field @orientation="horizontal">
        <Checkbox
          @checked={{true}}
          id="finder-pref-9k2-external-disks-1yg-checkbox"
          name="finder-pref-9k2-external-disks-1yg-checkbox"
        />
        <FieldLabel
          @class="font-normal"
          @for="finder-pref-9k2-external-disks-1yg-checkbox"
        >
          External disks
        </FieldLabel>
      </Field>
      <Field @orientation="horizontal">
        <Checkbox
          id="finder-pref-9k2-cds-dvds-fzt-checkbox"
          name="finder-pref-9k2-cds-dvds-fzt-checkbox"
        />
        <FieldLabel
          @class="font-normal"
          @for="finder-pref-9k2-cds-dvds-fzt-checkbox"
        >
          CDs, DVDs, and iPods
        </FieldLabel>
      </Field>
      <Field @orientation="horizontal">
        <Checkbox
          id="finder-pref-9k2-connected-servers-6l2-checkbox"
          name="finder-pref-9k2-connected-servers-6l2-checkbox"
        />
        <FieldLabel
          @class="font-normal"
          @for="finder-pref-9k2-connected-servers-6l2-checkbox"
        >
          Connected servers
        </FieldLabel>
      </Field>
    </FieldGroup>
  </FieldSet>
</template>
