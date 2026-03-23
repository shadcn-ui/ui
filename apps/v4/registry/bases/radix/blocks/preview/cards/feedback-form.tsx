"use client"

import { Button } from "@/registry/bases/radix/ui/button"
import { Card, CardContent, CardFooter } from "@/registry/bases/radix/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/registry/bases/radix/ui/field"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/radix/ui/native-select"
import { Textarea } from "@/registry/bases/radix/ui/textarea"

export function FeedbackForm() {
  return (
    <Card>
      <CardContent>
        <form id="feedback-form">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="topic">Topic</FieldLabel>
              <NativeSelect id="topic">
                <NativeSelectOption value="">Select a topic</NativeSelectOption>
                <NativeSelectOption value="ai">AI</NativeSelectOption>
                <NativeSelectOption value="accounts-and-access-controls">
                  Accounts and Access Controls
                </NativeSelectOption>
                <NativeSelectOption value="billing">Billing</NativeSelectOption>
                <NativeSelectOption value="cdn">
                  CDN (Firewall, Caching)
                </NativeSelectOption>
                <NativeSelectOption value="ci-cd">
                  CI/CD (Builds, Deployments, Environment Variables)
                </NativeSelectOption>
                <NativeSelectOption value="dashboard-interface">
                  Dashboard Interface (Navigation, UI Issues)
                </NativeSelectOption>
                <NativeSelectOption value="domains">Domains</NativeSelectOption>
                <NativeSelectOption value="frameworks">
                  Frameworks
                </NativeSelectOption>
                <NativeSelectOption value="marketplace-and-integrations">
                  Marketplace and Integrations
                </NativeSelectOption>
                <NativeSelectOption value="observability">
                  Observability (Observability, Logs, Monitoring)
                </NativeSelectOption>
                <NativeSelectOption value="storage">Storage</NativeSelectOption>
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor="feedback">Feedback</FieldLabel>
              <Textarea
                id="feedback"
                placeholder="Your feedback helps us improve..."
              />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="feedback-form">
          Submit
        </Button>
      </CardFooter>
    </Card>
  )
}
