"use client"

import {
  roleLabels,
  teamSizeLabels,
  type OnboardingValues,
} from "@/registry/bases/aria/blocks/onboarding-01/components/onboarding-schema"
import { Button } from "@/registry/bases/aria/ui/button"
import { FieldDescription } from "@/registry/bases/aria/ui/field"
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "@/registry/bases/aria/ui/item"

export function StepReview({
  values,
  onEdit,
}: {
  values: OnboardingValues
  onEdit: (stepIndex: number) => void
}) {
  const sections = [
    {
      stepIndex: 0,
      title: "Account",
      rows: [
        { label: "Full name", value: values.fullName },
        { label: "Email", value: values.email },
      ],
    },
    {
      stepIndex: 1,
      title: "Workspace",
      rows: [
        { label: "Name", value: values.workspaceName },
        { label: "URL", value: `acme.com/${values.workspaceSlug}` },
        { label: "Team size", value: teamSizeLabels[values.teamSize] },
      ],
    },
    {
      stepIndex: 2,
      title: "Preferences",
      rows: [
        { label: "Role", value: roleLabels[values.role] },
        {
          label: "Product updates",
          value: values.productUpdates ? "Subscribed" : "Not subscribed",
        },
        {
          label: "Weekly digest",
          value: values.weeklyDigest ? "Subscribed" : "Not subscribed",
        },
      ],
    },
  ]

  return (
    <ItemGroup className="gap-4">
      {sections.map((section) => (
        <Item key={section.title} variant="outline" className="items-start">
          <ItemContent className="gap-3">
            <div className="flex items-center justify-between gap-2">
              <ItemTitle>{section.title}</ItemTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onPress={() => onEdit(section.stepIndex)}
              >
                Edit
                <span className="sr-only"> {section.title}</span>
              </Button>
            </div>
            <dl className="grid gap-2 text-sm sm:grid-cols-[minmax(0,9rem)_1fr]">
              {section.rows.map((row) => (
                <div key={row.label} className="contents">
                  <dt className="text-muted-foreground">{row.label}</dt>
                  <dd className="truncate font-medium">{row.value}</dd>
                </div>
              ))}
            </dl>
          </ItemContent>
        </Item>
      ))}
      <FieldDescription>
        By creating a workspace you agree to our{" "}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </ItemGroup>
  )
}
