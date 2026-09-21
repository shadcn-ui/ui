"use client"

import { Controller, useFormContext } from "react-hook-form"

import {
  roleLabels,
  type OnboardingValues,
} from "@/registry/new-york-v4/blocks/onboarding-01/components/onboarding-schema"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/registry/new-york-v4/ui/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/new-york-v4/ui/radio-group"
import { Switch } from "@/registry/new-york-v4/ui/switch"

export function StepPreferences() {
  const { control } = useFormContext<OnboardingValues>()

  return (
    <FieldGroup>
      <Controller
        control={control}
        name="role"
        render={({ field, fieldState }) => (
          <FieldSet data-invalid={!!fieldState.error}>
            <FieldLegend variant="label">
              What best describes your role?
            </FieldLegend>
            <FieldDescription>
              We use this to suggest templates after setup.
            </FieldDescription>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              aria-invalid={!!fieldState.error}
              className="gap-3"
            >
              {Object.entries(roleLabels).map(([value, label]) => (
                <Field key={value} orientation="horizontal">
                  <RadioGroupItem value={value} id={`role-${value}`} />
                  <FieldLabel htmlFor={`role-${value}`} className="font-normal">
                    {label}
                  </FieldLabel>
                </Field>
              ))}
            </RadioGroup>
            <FieldError errors={[fieldState.error]} />
          </FieldSet>
        )}
      />
      <FieldSet>
        <FieldLegend variant="label">Email preferences</FieldLegend>
        <FieldGroup className="gap-4">
          <Controller
            control={control}
            name="productUpdates"
            render={({ field }) => (
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="productUpdates">
                    Product updates
                  </FieldLabel>
                  <FieldDescription>
                    New features and improvements, roughly once a month.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="productUpdates"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="weeklyDigest"
            render={({ field }) => (
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="weeklyDigest">Weekly digest</FieldLabel>
                  <FieldDescription>
                    A Monday summary of activity in your workspace.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="weeklyDigest"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  )
}
