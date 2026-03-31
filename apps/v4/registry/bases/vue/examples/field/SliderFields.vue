<script setup lang="ts">
import { ref } from "vue"
import { Example } from "@/components/example"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/ui/field"
import { Slider } from "@/ui/slider"

const volume = ref([50])
const brightness = ref([75])
const temperature = ref([0.3, 0.7])
const priceRange = ref([25, 75])
const colorBalance = ref([10, 20, 70])
</script>

<template>
  <Example title="Slider Fields">
    <FieldGroup>
      <Field>
        <FieldLabel html-for="slider-volume">
          Volume
        </FieldLabel>
        <Slider
          id="slider-volume"
          v-model="volume"
          :max="100"
          :step="1"
        />
      </Field>
      <Field>
        <FieldLabel html-for="slider-brightness">
          Screen Brightness
        </FieldLabel>
        <Slider
          id="slider-brightness"
          v-model="brightness"
          :max="100"
          :step="5"
        />
        <FieldDescription>
          Current brightness: {{ brightness[0] }}%
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel html-for="slider-quality">
          Video Quality
        </FieldLabel>
        <FieldDescription>
          Higher quality uses more bandwidth.
        </FieldDescription>
        <Slider
          id="slider-quality"
          :default-value="[720]"
          :max="1080"
          :min="360"
          :step="360"
        />
      </Field>
      <Field>
        <FieldLabel html-for="slider-temperature">
          Temperature Range
        </FieldLabel>
        <Slider
          id="slider-temperature"
          v-model="temperature"
          :min="0"
          :max="1"
          :step="0.1"
        />
        <FieldDescription>
          Range: {{ temperature[0].toFixed(1) }} - {{ temperature[1].toFixed(1) }}
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel html-for="slider-price-range">
          Price Range
        </FieldLabel>
        <Slider
          id="slider-price-range"
          v-model="priceRange"
          :max="100"
          :step="5"
        />
        <FieldDescription>
          ${{ priceRange[0] }} - ${{ priceRange[1] }}
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel html-for="slider-color-balance">
          Color Balance
        </FieldLabel>
        <Slider
          id="slider-color-balance"
          v-model="colorBalance"
          :max="100"
          :step="10"
        />
        <FieldDescription>
          Red: {{ colorBalance[0] }}%, Green: {{ colorBalance[1] }}%, Blue: {{ colorBalance[2] }}%
        </FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel html-for="slider-invalid">
          Invalid Slider
        </FieldLabel>
        <Slider
          id="slider-invalid"
          :default-value="[30]"
          :max="100"
          :aria-invalid="true"
        />
        <FieldDescription>
          This slider has validation errors.
        </FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel html-for="slider-disabled-field">
          Disabled Slider
        </FieldLabel>
        <Slider
          id="slider-disabled-field"
          :default-value="[50]"
          :max="100"
          disabled
        />
        <FieldDescription>
          This slider is currently disabled.
        </FieldDescription>
      </Field>
    </FieldGroup>
  </Example>
</template>
