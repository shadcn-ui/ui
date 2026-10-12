import {
  ArrowUpRightIcon,
  BotIcon,
  FileTextIcon,
  GlobeIcon,
  SearchIcon,
  TerminalIcon,
} from "lucide-react"

import { Badge } from "@/styles/aria-rhea/ui/badge"
import { CodeBlock, CodeBlockContent } from "@/styles/aria-rhea/ui/code-block"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/aria-rhea/ui/trace"

export function AgentDemo() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultExpanded>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <BotIcon />
            </TraceIcon>
            <TraceTitle>Ran the research agent</TraceTitle>
            <TraceDescription>48s</TraceDescription>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary">anthropic/claude-sonnet-4.5</Badge>
            <Badge variant="outline" className="font-mono">
              searchWeb
            </Badge>
            <Badge variant="outline" className="font-mono">
              readFile
            </Badge>
            <Badge variant="outline" className="font-mono">
              runCommand
            </Badge>
          </div>
          <p>Find out why image optimization reruns on every deploy.</p>
          <Trace>
            <TraceLine>
              <TraceIcon>
                <SearchIcon />
              </TraceIcon>
              <TraceTitle>
                Searched the web for next.js image cache key
              </TraceTitle>
            </TraceLine>
            <a
              href="https://nextjs.org/docs/app/api-reference/components/image"
              target="_blank"
              rel="noreferrer"
            >
              <TraceLine>
                <TraceIcon>
                  <GlobeIcon />
                </TraceIcon>
                <TraceTitle>
                  Read Image component | nextjs.org
                  <span className="sr-only"> (opens in a new tab)</span>
                </TraceTitle>
                <TraceIcon>
                  <ArrowUpRightIcon />
                </TraceIcon>
              </TraceLine>
            </a>
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
                <TraceLine>
                  <TraceIcon>
                    <TerminalIcon />
                  </TraceIcon>
                  <TraceTitle>Ran grep -rn cacheKey scripts</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <CodeBlock size="sm">
                  <CodeBlockContent wrap className="max-h-64">
                    scripts/optimize-images.ts:14: const cacheKey = commitSha
                  </CodeBlockContent>
                </CodeBlock>
              </TraceCollapsibleContent>
            </TraceCollapsible>
            <TraceLine>
              <TraceIcon>
                <FileTextIcon />
              </TraceIcon>
              <TraceTitle>Read scripts/optimize-images.ts</TraceTitle>
            </TraceLine>
          </Trace>
          <p>
            The image cache is keyed on the commit hash, so every deploy
            optimizes all 1,240 images again. Keying it on the image directory
            would skip unchanged images.
          </p>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
