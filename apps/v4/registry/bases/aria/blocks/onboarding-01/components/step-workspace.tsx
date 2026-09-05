"use client"

import { Controller, useFormContext } from "react-hook-form"

import {
  teamSizeLabels,
  type OnboardingValues,
} from "@/registry/bases/aria/blocks/onboarding-01/components/onboarding-schema"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/registry/bases/aria/ui/field"
import { Input } from "@/registry/bases/aria/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/registry/bases/aria/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/aria/ui/select"

export function StepWorkspace() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<OnboardingValues>()

  return (
    <FieldGroup>
      <Field data-invalid={!!errors.workspaceName}>
        <FieldLabel htmlFor="workspaceName">Workspace name</FieldLabel>
        <Input
          id="workspaceName"
          autoComplete="organization"
          placeholder="Acme Inc."
          aria-invalid={!!errors.workspaceName}
          {...register("workspaceName")}
        />
        <FieldError errors={[errors.workspaceName]} />
      </Field>
      <Field data-invalid={!!errors.workspaceSlug}>
        <FieldLabel htmlFor="workspaceSlug">Workspace URL</FieldLabel>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>acme.com/</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            id="workspaceSlug"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="acme"
            aria-invalid={!!errors.workspaceSlug}
            {...register("workspaceSlug")}
          />
        </InputGroup>
        <FieldDescription>
          Lowercase letters, numbers and hyphens only.
        </FieldDescription>
        <FieldError errors={[errors.workspaceSlug]} />
      </Field>
      <Controller
        control={control}
        name="teamSize"
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel htmlFor="teamSize">Team size</FieldLabel>
            <Select
              value={field.value}
              onChange={(value) => {
                if (value !== null) {
                  field.onChange(String(value))
                }
              }}
            >
              <SelectTrigger
                id="teamSize"
                aria-invalid={!!fieldState.error}
                className="w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(teamSizeLabels).map(([value, label]) => (
                  <SelectItem key={value} id={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </FieldGroup>
  )
}
