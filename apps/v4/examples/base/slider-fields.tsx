"use client"

import * as React from "react"
import { useState } from "react"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/examples/base/ui/field"
import { Slider } from "@/examples/base/ui/slider"

export function SliderFields() {
  const [volume, setVolume] = useState([50])
  const [brightness, setBrightness] = useState([75])
  const [temperature, setTemperature] = useState([0.3, 0.7])
  const [priceRange, setPriceRange] = useState([25, 75])
  const [colorBalance, setColorBalance] = useState([10, 20, 70])

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="slider-volume">Volume</FieldLabel>
        <Slider
          id="slider-volume"
          value={volume}
          onValueChange={(value) => setVolume(value as number[])}
          max={100}
          step={1}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="slider-brightness">Screen Brightness</FieldLabel>
        <Slider
          id="slider-brightness"
          value={brightness}
          onValueChange={(value) => setBrightness(value as number[])}
          max={100}
          step={5}
        />
        <FieldDescription>
          Current brightness: {brightness[0]}%
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="slider-quality">Video Quality</FieldLabel>
        <FieldDescription>Higher quality uses more bandwidth.</FieldDescription>
        <Slider
          id="slider-quality"
          defaultValue={[720]}
          max={1080}
          min={360}
          step={360}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="slider-temperature">Temperature Range</FieldLabel>
        <Slider
          id="slider-temperature"
          value={temperature}
          onValueChange={(value) => setTemperature(value as number[])}
          min={0}
          max={1}
          step={0.1}
        />
        <FieldDescription>
          Range: {temperature[0].toFixed(1)} - {temperature[1].toFixed(1)}
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="slider-price-range">Price Range</FieldLabel>
        <Slider
          id="slider-price-range"
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as number[])}
          max={100}
          step={5}
        />
        <FieldDescription>
          ${priceRange[0]} - ${priceRange[1]}
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="slider-color-balance">Color Balance</FieldLabel>
        <Slider
          id="slider-color-balance"
          value={colorBalance}
          onValueChange={(value) => setColorBalance(value as number[])}
          max={100}
          step={10}
        />
        <FieldDescription>
          Red: {colorBalance[0]}%, Green: {colorBalance[1]}%, Blue:{" "}
          {colorBalance[2]}%
        </FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="slider-invalid">Invalid Slider</FieldLabel>
        <Slider
          id="slider-invalid"
          defaultValue={[30]}
          max={100}
          aria-invalid
        />
        <FieldDescription>This slider has validation errors.</FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel htmlFor="slider-disabled-field">Disabled Slider</FieldLabel>
        <Slider
          id="slider-disabled-field"
          defaultValue={[50]}
          max={100}
          disabled
        />
        <FieldDescription>This slider is currently disabled.</FieldDescription>
      </Field>
    </FieldGroup>
  )
}
