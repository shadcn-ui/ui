import {
  CircleCheckIcon,
  CircleDotIcon,
  CircleIcon,
  RouteIcon,
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
} from "@/styles/base-rhea/ui/trace"

const steps: { title: string; status: "done" | "running" | "pending" }[] = [
  { title: "Install @base-ui/react", status: "done" },
  { title: "Replace the Radix imports", status: "done" },
  { title: "Rename asChild to render", status: "running" },
  { title: "Update the data-state selectors", status: "pending" },
  { title: "Run the type checker", status: "pending" },
]

export function PlanBasic() {
  const done = steps.filter((step) => step.status === "done").length

  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="running">
            <TraceIcon>
              <RouteIcon />
            </TraceIcon>
            <TraceTitle>Plan: migrate to Base UI</TraceTitle>
            <TraceDescription>
              {done} of {steps.length} done
            </TraceDescription>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {steps.map((step) => (
              <TraceLine
                key={step.title}
                status={step.status === "done" ? undefined : step.status}
              >
                <TraceIcon>
                  {step.status === "done" ? (
                    <CircleCheckIcon />
                  ) : step.status === "running" ? (
                    <CircleDotIcon />
                  ) : (
                    <CircleIcon />
                  )}
                </TraceIcon>
                <TraceTitle>{step.title}</TraceTitle>
              </TraceLine>
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
