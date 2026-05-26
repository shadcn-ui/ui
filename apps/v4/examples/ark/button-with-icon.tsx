import { Button } from "@/examples/ark/ui/button"
import { IconGitBranch } from "@tabler/icons-react"

export default function ButtonWithIcon() {
  return (
    <Button variant="outline" size="sm">
      <IconGitBranch /> New Branch
    </Button>
  )
}
