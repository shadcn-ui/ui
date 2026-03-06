import { Button } from "@/examples/radix/ui/button"
import { IconGitBranch } from "@tabler/icons-react"

export default function ButtonWithIcon() {
  return (
    <Button variant="outline" size="sm">
      <IconGitBranch /> New Branch
    </Button>
  )
}
