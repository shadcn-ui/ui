import { CircleXIcon } from "lucide-react"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/radix-rhea/ui/trace"

const STACK = `TypeError: Cannot read properties of undefined (reading 'map')
    at UserList (app/components/user-list.tsx:15:23)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:14985:18)
    at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:17811:13)
    at beginWork (node_modules/react-dom/cjs/react-dom.development.js:19049:16)
    at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:22776:12)
    at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:22707:5)`

const [error, ...frames] = STACK.split("\n").map((line) => line.trim())

export function StackTraceBasic() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <CircleXIcon />
            </TraceIcon>
            <TraceTitle>Failed: {error}</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <div className="flex flex-col gap-2 overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs">
            <p className="font-medium whitespace-pre-wrap text-destructive">
              {error}
            </p>
            <ol className="flex flex-col gap-1">
              {frames.map((frame, index) => (
                <li
                  key={index}
                  className={
                    frame.includes("node_modules")
                      ? "whitespace-nowrap"
                      : "whitespace-nowrap text-foreground"
                  }
                >
                  {frame}
                </li>
              ))}
            </ol>
          </div>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
