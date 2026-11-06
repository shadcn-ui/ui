"use client"

import { useFormContext } from "react-hook-form"

import { type OnboardingValues } from "@/registry/bases/base/blocks/onboarding-01/components/onboarding-schema"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"

export function StepAccount() {
  const {
    register,
    formState: { errors },
  } = useFormContext<OnboardingValues>()

  return (
    <FieldGroup>
      <Field data-invalid={!!errors.fullName}>
        <FieldLabel htmlFor="fullName">Full name</FieldLabel>
        <Input
          id="fullName"
          autoComplete="name"
          placeholder="Ada Lovelace"
          aria-invalid={!!errors.fullName}
          {...register("fullName")}
        />
        <FieldError errors={[errors.fullName]} />
      </Field>
      <Field data-invalid={!!errors.email}>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="m@example.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        <FieldDescription>
          We&apos;ll send your workspace invite here.
        </FieldDescription>
        <FieldError errors={[errors.email]} />
      </Field>
    </FieldGroup>
  )
}
