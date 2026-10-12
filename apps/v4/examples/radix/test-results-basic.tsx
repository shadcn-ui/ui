import { CheckIcon, FlaskConicalIcon, XIcon } from "lucide-react"

import { CodeBlock, CodeBlockContent } from "@/styles/radix-rhea/ui/code-block"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/radix-rhea/ui/trace"

const tests: { name: string; error?: string }[] = [
  { name: "formats a price in USD" },
  { name: "formats a price in EUR" },
  {
    name: "rounds to two decimals",
    error: `Expected "$10.13", received "$10.125"

  at Object.<anonymous> (src/format-price.test.ts:31:18)`,
  },
  { name: "formats zero as free" },
  { name: "rejects a negative price" },
]

const failed = tests.filter((test) => test.error).length

export function TestResultsBasic() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <FlaskConicalIcon />
            </TraceIcon>
            <TraceTitle>
              Ran {tests.length} tests, {failed} failed
            </TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {tests.map((test) =>
              test.error ? (
                <TraceCollapsible key={test.name} defaultOpen>
                  <TraceCollapsibleTrigger>
                    <TraceLine status="error">
                      <TraceIcon>
                        <XIcon />
                      </TraceIcon>
                      <TraceTitle>{test.name}</TraceTitle>
                    </TraceLine>
                  </TraceCollapsibleTrigger>
                  <TraceCollapsibleContent>
                    <CodeBlock size="sm">
                      <CodeBlockContent wrap className="max-h-64">
                        {test.error}
                      </CodeBlockContent>
                    </CodeBlock>
                  </TraceCollapsibleContent>
                </TraceCollapsible>
              ) : (
                <TraceLine key={test.name}>
                  <TraceIcon>
                    <CheckIcon />
                  </TraceIcon>
                  <TraceTitle>{test.name}</TraceTitle>
                </TraceLine>
              )
            )}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
