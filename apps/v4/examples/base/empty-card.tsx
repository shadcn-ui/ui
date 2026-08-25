import { ArrowUpRightIcon, FolderIcon } from "lucide-react"

import { Button, buttonVariants } from "@/styles/base-nova/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/styles/base-nova/ui/empty"

export function EmptyInCard() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating
          your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <a href="#" className={buttonVariants()}>
            Create project
          </a>
          <Button variant="outline">Import project</Button>
        </div>
        <a
          href="#"
          className={buttonVariants({
            variant: "link",
            className: "text-muted-foreground",
          })}
        >
          Learn more <ArrowUpRightIcon />
        </a>
      </EmptyContent>
    </Empty>
  )
}
