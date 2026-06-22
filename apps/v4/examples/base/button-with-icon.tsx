import { IconGitBranch, IconGitFork } from "@/examples/material-symbols"

import { Button } from "@/styles/base-force-ui/ui/button"

export default function ButtonWithIcon() {
  return (
    <div className="flex gap-2">
      <Button variant="outline">
        <IconGitBranch data-icon="inline-start" /> New Branch
      </Button>
      <Button variant="outline">
        Fork
        <IconGitFork data-icon="inline-end" />
      </Button>
    </div>
  )
}
