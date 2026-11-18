"use client"

import { Button } from "@/registry/bases/aria/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/aria/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/registry/bases/aria/ui/field"
import { Input } from "@/registry/bases/aria/ui/input"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/aria/ui/item"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function AccountAccess() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Access</CardTitle>
        <CardDescription>
          Update your credentials or re-authenticate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email-address">Email Address</FieldLabel>
            <Input
              id="email-address"
              type="email"
              defaultValue="artist@example.com"
            />
          </Field>
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="current-password">
                Current Password
              </FieldLabel>
              <a
                href="#"
                className="text-xs font-medium tracking-wider text-muted-foreground uppercase hover:text-foreground"
              >
                Forgot?
              </a>
            </div>
            <Input
              id="current-password"
              type="password"
              defaultValue="password123"
            />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Button className="w-full">
          <IconPlaceholder
            lucide="LockKeyholeIcon"
            tabler="IconLock"
            hugeicons="SquareLock02Icon"
            phosphor="LockKeyIcon"
            remixicon="RiLockLine"
          />
          Update Security
        </Button>
        <Item variant="muted" href="#">
          <ItemMedia variant="icon">
            <IconPlaceholder
              lucide="AlertCircleIcon"
              tabler="IconAlertCircle"
              hugeicons="AlertCircleIcon"
              phosphor="WarningCircleIcon"
              remixicon="RiErrorWarningLine"
              className="text-destructive"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Danger Zone</ItemTitle>
            <ItemDescription className="line-clamp-1">
              Archive account and remove catalog
            </ItemDescription>
          </ItemContent>
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight01Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            className="size-4"
          />
        </Item>
      </CardFooter>
    </Card>
  )
}
