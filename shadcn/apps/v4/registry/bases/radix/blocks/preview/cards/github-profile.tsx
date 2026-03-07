"use client"

import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/registry/bases/radix/ui/field"
import { Input } from "@/registry/bases/radix/ui/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/radix/ui/native-select"
import { Textarea } from "@/registry/bases/radix/ui/textarea"

export function GithubProfile() {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your profile information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="profile">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" placeholder="shadcn" />
              <FieldDescription>
                Your name may appear around GitHub where you contribute or are
                mentioned. You can remove it at any time.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Public Email</FieldLabel>
              <NativeSelect id="email">
                <NativeSelectOption value="m@shadcn.com">
                  m@shadcn.com
                </NativeSelectOption>
                <NativeSelectOption value="m@gmail.com">
                  m@gmail.com
                </NativeSelectOption>
              </NativeSelect>
              <FieldDescription>
                You can manage verified email addresses in your{" "}
                <a href="#email-settings">email settings</a>.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="bio">Bio</FieldLabel>
              <Textarea
                id="bio"
                placeholder="Tell us a little bit about yourself"
              />
              <FieldDescription>
                You can <span>@mention</span> other users and organizations to
                link to them.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button form="profile">Save Profile</Button>
      </CardFooter>
    </Card>
  )
}
