import { IconGitBranch } from "@/examples/material-symbols"

import { Button } from "@/styles/radix-force-ui/ui/button"

export default function ButtonWithIcon() {
  return (
    <Button variant="outline" size="sm">
      <IconGitBranch /> New Branch
    </Button>
  )
}
