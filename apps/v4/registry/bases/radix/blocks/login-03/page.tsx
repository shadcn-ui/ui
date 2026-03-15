"use client"

import { LoginForm } from "@/registry/bases/radix/blocks/login-03/components/login-form"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <IconPlaceholder
              lucide="GalleryVerticalEndIcon"
              tabler="IconLayoutRows"
              hugeicons="LayoutBottomIcon"
              phosphor="RowsIcon"
              remixicon="RiGalleryLine"
              className="size-4"
            />
          </div>
          Acme Inc.
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
