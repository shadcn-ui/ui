import {
  FileMinusIcon,
  FilePenIcon,
  FilePlusIcon,
  GitCommitHorizontalIcon,
} from "lucide-react"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/radix-rhea/ui/trace"

const files: {
  path: string
  change: "added" | "edited" | "deleted"
  additions: number
  deletions: number
}[] = [
  { path: "app/login/page.tsx", change: "edited", additions: 12, deletions: 3 },
  {
    path: "lib/auth/redirect.ts",
    change: "added",
    additions: 28,
    deletions: 0,
  },
  { path: "lib/auth/session.ts", change: "edited", additions: 4, deletions: 9 },
  { path: "middleware.old.ts", change: "deleted", additions: 0, deletions: 24 },
]

const changes = {
  added: { icon: <FilePlusIcon />, verb: "Added" },
  edited: { icon: <FilePenIcon />, verb: "Edited" },
  deleted: { icon: <FileMinusIcon />, verb: "Deleted" },
}

export function CommitBasic() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <GitCommitHorizontalIcon />
            </TraceIcon>
            <TraceTitle>Committed a1b2c3: Fix the login redirect</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {files.map((file) => (
              <TraceLine key={file.path}>
                <TraceIcon>{changes[file.change].icon}</TraceIcon>
                <TraceTitle>
                  {changes[file.change].verb} {file.path}
                </TraceTitle>
                <TraceDescription className="font-mono">
                  +{file.additions} −{file.deletions}
                </TraceDescription>
              </TraceLine>
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
