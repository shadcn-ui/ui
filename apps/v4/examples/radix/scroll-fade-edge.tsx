const items = [
  "Inbox triage",
  "Design review",
  "API contract",
  "QA pass",
  "Launch notes",
  "Metrics follow-up",
]

const tags = [
  "Design",
  "Engineering",
  "Marketing",
  "Product",
  "Research",
  "Sales",
  "Support",
  "Operations",
]

export function ScrollFadeEdge() {
  return (
    <div className="mx-auto flex max-w-xs min-w-0 flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-2xl border">
          <div className="h-36 scroll-fade-t scrollbar-none overflow-y-auto">
            <ScrollFadeEdgeItems />
          </div>
        </div>
        <p className="text-center font-mono text-xs text-muted-foreground">
          scroll-fade-t
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-2xl border">
          <div className="h-36 scroll-fade-b scrollbar-none overflow-y-auto">
            <ScrollFadeEdgeItems />
          </div>
        </div>
        <p className="text-center font-mono text-xs text-muted-foreground">
          scroll-fade-b
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-2xl border">
          <div className="scroll-fade-s scrollbar-none overflow-x-auto">
            <ScrollFadeEdgeTags />
          </div>
        </div>
        <p className="text-center font-mono text-xs text-muted-foreground">
          scroll-fade-s
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-2xl border">
          <div className="scroll-fade-e scrollbar-none overflow-x-auto">
            <ScrollFadeEdgeTags />
          </div>
        </div>
        <p className="text-center font-mono text-xs text-muted-foreground">
          scroll-fade-e
        </p>
      </div>
    </div>
  )
}

function ScrollFadeEdgeItems() {
  return (
    <div className="flex flex-col gap-1.5 p-1.5">
      {items.map((item) => (
        <div key={item} className="rounded-lg bg-muted px-3 py-2.5 text-sm">
          {item}
        </div>
      ))}
    </div>
  )
}

function ScrollFadeEdgeTags() {
  return (
    <div className="flex w-max gap-1.5 p-1.5">
      {tags.map((tag) => (
        <div
          key={tag}
          className="shrink-0 rounded-xl bg-muted px-4 py-2.5 text-sm"
        >
          {tag}
        </div>
      ))}
    </div>
  )
}
