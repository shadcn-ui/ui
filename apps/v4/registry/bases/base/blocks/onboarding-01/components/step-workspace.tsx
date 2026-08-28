"use client"

import { Controller, useFormContext } from "react-hook-form"

import {
  teamSizeLabels,
  type OnboardingValues,
} from "@/registry/bases/base/blocks/onboarding-01/components/onboarding-schema"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/registry/bases/base/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"

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
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="teamSize"
                aria-invalid={!!fieldState.error}
                className="w-full"
              >
                <SelectValue placeholder="Select a team size" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(teamSizeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
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
