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
import { Field, FieldLabel } from "@/registry/bases/aria/ui/field"
import { Input } from "@/registry/bases/aria/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/bases/aria/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/aria/ui/select"
import { Separator } from "@/registry/bases/aria/ui/separator"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function InviteTeam() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Team</CardTitle>
        <CardDescription>Add members to your workspace</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          {[
            { email: "alex@example.com", role: "Editor" },
            { email: "sam@example.com", role: "Viewer" },
          ].map((invite) => (
            <div key={invite.email} className="flex items-center gap-2">
              <Input defaultValue={invite.email} className="flex-1" />
              <Select defaultValue={invite.role.toLowerCase()}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent placement="bottom end">
                  <SelectGroup>
                    <SelectItem id="admin">Admin</SelectItem>
                    <SelectItem id="editor">Editor</SelectItem>
                    <SelectItem id="viewer">Viewer</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <Button variant="outline">
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
            phosphor="PlusIcon"
            remixicon="RiAddLine"
            data-icon="inline-start"
          />
          Add another
        </Button>
        <Separator />
        <Field>
          <FieldLabel htmlFor="invite-link">Or share invite link</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="invite-link"
              defaultValue="https://app.co/invite/x8f2k"
              readOnly
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label="Copy link">
                <IconPlaceholder
                  lucide="CopyIcon"
                  tabler="IconCopy"
                  hugeicons="Copy01Icon"
                  phosphor="CopyIcon"
                  remixicon="RiFileCopyLine"
                />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Send Invites</Button>
      </CardFooter>
    </Card>
  )
}
