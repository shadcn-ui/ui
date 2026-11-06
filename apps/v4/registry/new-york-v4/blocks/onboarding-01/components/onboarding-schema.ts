import { z } from "zod"

export const accountSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(64, { message: "Name must be 64 characters or less." }),
  email: z.string().email({ message: "Enter a valid email address." }),
})

export const workspaceSchema = z.object({
  workspaceName: z
    .string()
    .min(2, { message: "Workspace name must be at least 2 characters." })
    .max(48, { message: "Workspace name must be 48 characters or less." }),
  workspaceSlug: z
    .string()
    .min(3, { message: "URL must be at least 3 characters." })
    .max(32, { message: "URL must be 32 characters or less." })
    .regex(/^[a-z0-9-]+$/, {
      message: "Use lowercase letters, numbers and hyphens only.",
    }),
  teamSize: z.enum(["1", "2-10", "11-50", "51-200", "200+"], {
    required_error: "Select a team size.",
  }),
})

export const preferencesSchema = z.object({
  role: z.enum(["engineering", "design", "product", "marketing", "other"], {
    required_error: "Select the option that best describes your role.",
  }),
  productUpdates: z.boolean(),
  weeklyDigest: z.boolean(),
})

export const onboardingSchema = accountSchema
  .merge(workspaceSchema)
  .merge(preferencesSchema)

export type OnboardingValues = z.infer<typeof onboardingSchema>

export const onboardingDefaultValues: OnboardingValues = {
  fullName: "",
  email: "",
  workspaceName: "",
  workspaceSlug: "",
  teamSize: "2-10",
  role: "engineering",
  productUpdates: true,
  weeklyDigest: false,
}

export const steps = [
  {
    id: "account",
    title: "Account",
    description: "Tell us who you are.",
    fields: ["fullName", "email"],
  },
  {
    id: "workspace",
    title: "Workspace",
    description: "Set up where your team will work.",
    fields: ["workspaceName", "workspaceSlug", "teamSize"],
  },
  {
    id: "preferences",
    title: "Preferences",
    description: "Tailor your experience.",
    fields: ["role", "productUpdates", "weeklyDigest"],
  },
  {
    id: "review",
    title: "Review",
    description: "Check everything looks right.",
    fields: [],
  },
] as const satisfies ReadonlyArray<{
  id: string
  title: string
  description: string
  fields: ReadonlyArray<keyof OnboardingValues>
}>

export type OnboardingStep = (typeof steps)[number]

export const teamSizeLabels: Record<OnboardingValues["teamSize"], string> = {
  "1": "Just me",
  "2-10": "2–10 people",
  "11-50": "11–50 people",
  "51-200": "51–200 people",
  "200+": "200+ people",
}

export const roleLabels: Record<OnboardingValues["role"], string> = {
  engineering: "Engineering",
  design: "Design",
  product: "Product",
  marketing: "Marketing",
  other: "Other",
}
