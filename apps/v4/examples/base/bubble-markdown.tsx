import { Markdown } from "@/components/markdown"
import { Bubble, BubbleContent } from "@/styles/base-rhea/ui/bubble"

export function BubbleMarkdownDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Bubble align="end" variant="muted">
        <BubbleContent>
          <Markdown>{`Hello! Are you actually **thinking**?`}</Markdown>
        </BubbleContent>
      </Bubble>
      <Bubble variant="ghost">
        <BubbleContent>
          <Markdown>{`Ghost bubbles work for assistant text, **markdown**, and other content that should not be framed.

This is perfect for assistant messages that should not have a frame and can take the full width of the container. You can also render \`code\` in it.

Ghost bubbles are full width and can take the full width of the container.
`}</Markdown>
        </BubbleContent>
      </Bubble>
    </div>
  )
}
