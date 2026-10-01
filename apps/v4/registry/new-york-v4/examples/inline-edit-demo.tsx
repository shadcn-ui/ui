"use client"

import { InlineEdit } from "@/registry/new-york-v4/ui/inline-edit"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"

export default function InlineEditDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <div className="space-y-2">
        <h3 className="text-muted-foreground text-sm font-medium">
          Basic Input
        </h3>
        <InlineEdit defaultValue="Click to edit me" />
      </div>

      <div className="space-y-2">
        <h3 className="text-muted-foreground text-sm font-medium">
          With Textarea
        </h3>
        <InlineEdit
          defaultValue="This uses a textarea for multiline editing."
          renderInput={(props) => <Textarea {...props} />}
          className="items-start"
          submitOnEnter={false}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-muted-foreground text-sm font-medium">
          Controlled, No Controls
        </h3>
        <InlineEdit defaultValue="Press Enter to save" showControls={false} />
      </div>
    </div>
  )
}
