"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/radix/components/example"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/registry/bases/radix/ui/bubble"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/registry/bases/radix/ui/collapsible"
import { Marker, MarkerContent } from "@/registry/bases/radix/ui/marker"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function BubbleExample() {
  return (
    <ExampleWrapper>
      <BubbleSizes />
      <BubbleVariants />
      <BubbleAlignment />
      <BubbleGrouped />
      <BubbleCollapsible />
      <BubbleButtonLinks />
      <BubbleWithReactions />
      <BubbleReactionsButtons />
    </ExampleWrapper>
  )
}

function BubbleVariants() {
  return (
    <Example title="Variants">
      <div className="flex w-full max-w-md flex-col gap-8">
        <Bubble>
          <BubbleContent>
            Default bubbles use the primary color for the active user side of a
            chat.
          </BubbleContent>
        </Bubble>
        <Bubble variant="secondary">
          <BubbleContent>
            Secondary bubbles are the standard neutral surface for assistant and
            conversation content.
          </BubbleContent>
        </Bubble>
        <Bubble variant="muted">
          <BubbleContent>
            Muted bubbles lower the emphasis for quiet system notes or for
            displaying supporting content.
          </BubbleContent>
        </Bubble>
        <Bubble variant="tinted" align="end">
          <BubbleContent>
            Tinted bubbles use a softer primary tint when primary fill is too
            strong.
          </BubbleContent>
        </Bubble>
        <Bubble variant="outline">
          <BubbleContent>
            Outline bubbles can be used to frame message content and give it a
            border.
          </BubbleContent>
        </Bubble>
        <Bubble variant="destructive">
          <BubbleContent>
            Destructive bubbles flag errors or failed actions in a conversation.
          </BubbleContent>
        </Bubble>
        <Bubble variant="ghost">
          <BubbleContent>
            <span className="whitespace-pre-wrap">
              {`Ghost bubbles work for assistant text and other content that should not be framed.

This is perfect for assistant messages that should not have a frame and can take the full width of the container.

Ghost bubbles are full width and can take the full width of the container.
`}
            </span>
          </BubbleContent>
        </Bubble>
      </div>
    </Example>
  )
}

function BubbleSizes() {
  return (
    <Example title="Sizes">
      <div className="flex w-full max-w-md flex-col gap-8">
        <Bubble>
          <BubbleContent>This is a one line bubble.</BubbleContent>
        </Bubble>
        <Bubble>
          <BubbleContent>
            This bubble has multiple lines. It should wrap to the next line and
            you should see a different radius on the corners.
          </BubbleContent>
        </Bubble>
        <Bubble>
          <BubbleContent>
            <p>This bubble has multiple lines.</p>
            <p>
              It should wrap to the next line and you should see a different
              radius on the corners.
            </p>
            <p>Here is some more text to see how it wraps.</p>
          </BubbleContent>
        </Bubble>
      </div>
    </Example>
  )
}

function BubbleGrouped() {
  return (
    <Example title="Grouped">
      <div className="flex w-full max-w-md flex-col gap-8">
        <BubbleGroup>
          <Bubble variant="secondary">
            <BubbleContent>I finished the audit pass.</BubbleContent>
          </Bubble>
          <Bubble variant="secondary">
            <BubbleContent>
              The registry output looks clean, but I found one stale route.
            </BubbleContent>
          </Bubble>
          <Bubble variant="secondary">
            <BubbleContent>Want me to remove it now?</BubbleContent>
          </Bubble>
        </BubbleGroup>
        <BubbleGroup>
          <Bubble variant="tinted" align="end">
            <BubbleContent>Yes, clean that up.</BubbleContent>
          </Bubble>
          <Bubble variant="tinted" align="end">
            <BubbleContent>Then rerun the registry build.</BubbleContent>
          </Bubble>
        </BubbleGroup>
      </div>
    </Example>
  )
}

const text = `The accessibility review found two focus states that were visually too subtle in dark mode.

I checked the dialog, menu, and drawer paths because each one renders focusable controls inside a layered surface.

The dialog and drawer are fine. The menu needs the hover and focus tokens split so keyboard focus stays visible when the pointer is not involved.

I also recommend keeping the change in the style file instead of the primitive so the other themes can choose their own focus treatment later.`

const previewLength = 180

function BubbleCollapsible() {
  const [open, setOpen] = React.useState(false)
  const isLong = text.length > previewLength
  const preview = `${text.slice(0, previewLength)}...`

  return (
    <Example title="Collapsible">
      <div className="flex w-full max-w-md flex-col gap-8">
        <Collapsible open={open} onOpenChange={setOpen}>
          <Bubble variant="muted" align="end">
            <BubbleContent className="whitespace-pre-line">
              <div>{open || !isLong ? text : preview}</div>
              {isLong ? (
                <CollapsibleTrigger asChild>
                  <Button
                    variant="link"
                    className="gap-1 p-0 text-muted-foreground"
                  >
                    {open ? "Show less" : "Show more"}
                    <IconPlaceholder
                      lucide="ChevronDownIcon"
                      tabler="IconChevronDown"
                      hugeicons="ArrowDown01Icon"
                      phosphor="CaretDownIcon"
                      remixicon="RiArrowDownSLine"
                      data-icon="inline-end"
                      className="group-data-open/button:rotate-180"
                    />
                  </Button>
                </CollapsibleTrigger>
              ) : null}
            </BubbleContent>
          </Bubble>
        </Collapsible>
        <Bubble variant="ghost">
          <BubbleContent>
            <span className="whitespace-pre-wrap">
              {`Ghost bubbles work for assistant text and other content that should not be framed.

This is perfect for assistant messages that should not have a frame and can take the full width of the container.

Use this for content that needs the whole row.`}
            </span>
          </BubbleContent>
        </Bubble>
      </div>
    </Example>
  )
}

function BubbleWithReactions() {
  return (
    <Example title="Reaction Placement">
      <div className="flex w-full max-w-md flex-col gap-12">
        <Marker variant="separator">
          <MarkerContent>side=bottom align=end</MarkerContent>
        </Marker>
        <Bubble>
          <BubbleContent>This is a one line message.</BubbleContent>
          <BubbleReactions
            side="bottom"
            align="end"
            role="img"
            aria-label="Reaction: thumbs up"
          >
            <span>👍</span>
          </BubbleReactions>
        </Bubble>
        <Bubble variant="secondary" align="end">
          <BubbleContent>
            A longer message that wraps across lines so the reaction offset is
            easier to inspect.
          </BubbleContent>
          <BubbleReactions
            side="bottom"
            align="start"
            role="img"
            aria-label="Reactions: thumbs up, surprised"
          >
            <span>👍</span>
            <span>😮</span>
          </BubbleReactions>
        </Bubble>
        <Bubble variant="tinted">
          <BubbleContent>
            A longer message that wraps across lines so the reaction offset is
            easier to inspect.
          </BubbleContent>
          <BubbleReactions
            side="bottom"
            align="end"
            role="img"
            aria-label="Reactions: thumbs up, surprised, fire, eyes, and 8 more"
          >
            <span>👍</span>
            <span>😮</span>
            <span>🔥</span>
            <span>👀</span>
            <span>+8</span>
          </BubbleReactions>
        </Bubble>
        <Marker variant="separator">
          <MarkerContent>side=bottom align=start</MarkerContent>
        </Marker>
        <Bubble variant="secondary">
          <BubbleContent>This is a one line message.</BubbleContent>
          <BubbleReactions
            side="bottom"
            align="start"
            role="img"
            aria-label="Reaction: fire"
          >
            <span>🔥</span>
          </BubbleReactions>
        </Bubble>
        <Bubble variant="secondary">
          <BubbleContent>
            A longer message that wraps across lines so the reaction offset is
            easier to inspect.
          </BubbleContent>
          <BubbleReactions
            side="bottom"
            align="start"
            role="img"
            aria-label="Reactions: thumbs up, surprised, fire, eyes"
          >
            <span>👍</span>
            <span>😮</span>
            <span>🔥</span>
            <span>👀</span>
          </BubbleReactions>
        </Bubble>
        <Marker variant="separator">
          <MarkerContent>side=top align=start</MarkerContent>
        </Marker>
        <Bubble variant="secondary">
          <BubbleContent>This is a one line message.</BubbleContent>
          <BubbleReactions
            side="top"
            align="start"
            role="img"
            aria-label="Reaction: fire"
          >
            <span>🔥</span>
          </BubbleReactions>
        </Bubble>
        <Bubble variant="secondary">
          <BubbleContent>
            A longer message that wraps across lines so the reaction offset is
            easier to inspect.
          </BubbleContent>
          <BubbleReactions
            side="top"
            align="start"
            role="img"
            aria-label="Reactions: thumbs up, surprised, fire, eyes"
          >
            <span>👍</span>
            <span>😮</span>
            <span>🔥</span>
            <span>👀</span>
          </BubbleReactions>
        </Bubble>
        <Marker variant="separator">
          <MarkerContent>side=bottom align=end</MarkerContent>
        </Marker>
        <Bubble variant="muted">
          <BubbleContent>This is a one line message.</BubbleContent>
          <BubbleReactions
            side="top"
            align="end"
            role="img"
            aria-label="Reaction: thumbs up"
          >
            <span>👍</span>
          </BubbleReactions>
        </Bubble>
        <Bubble variant="muted">
          <BubbleContent>
            A longer message that wraps across lines so the reaction offset.
          </BubbleContent>
          <BubbleReactions
            side="top"
            align="end"
            role="img"
            aria-label="Reactions: thumbs up, surprised, fire, eyes"
            className="px-1.5 py-0.5"
          >
            <span>👍</span>
            <span>😮</span>
            <span>🔥</span>
            <span>👀</span>
          </BubbleReactions>
        </Bubble>
      </div>
    </Example>
  )
}

function BubbleReactionsButtons() {
  return (
    <Example title="Reactions Buttons">
      <div className="flex w-full max-w-md flex-col gap-8">
        <Bubble>
          <BubbleContent>This is a one line message.</BubbleContent>
          <BubbleReactions>
            <Button
              variant="outline"
              size="xs"
              onClick={() =>
                toast("You clicked the button in the bubble reaction")
              }
            >
              Button
            </Button>
          </BubbleReactions>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>This is a one line message.</BubbleContent>
          <BubbleReactions align="start">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => toast("Confetti!")}
            >
              🎉
            </Button>
          </BubbleReactions>
        </Bubble>
        <Bubble variant="tinted">
          <BubbleContent>
            We are going to the movies first then dinner. Are you in?
          </BubbleContent>
          <BubbleReactions className="gap-1 bg-background">
            <Button
              variant="secondary"
              size="icon-xs"
              aria-label="Thumbs up"
              onClick={() => toast("You agree!")}
            >
              <IconPlaceholder
                lucide="ThumbsUpIcon"
                tabler="IconThumbUp"
                hugeicons="ThumbsUpIcon"
                phosphor="ThumbsUpIcon"
                remixicon="RiThumbUpLine"
              />
            </Button>
            <Button
              variant="secondary"
              size="icon-xs"
              aria-label="Thumbs down"
              onClick={() => toast("You disagree!")}
            >
              <IconPlaceholder
                lucide="ThumbsDownIcon"
                tabler="IconThumbDown"
                hugeicons="ThumbsDownIcon"
                phosphor="ThumbsDownIcon"
                remixicon="RiThumbDownLine"
              />
            </Button>
          </BubbleReactions>
        </Bubble>
      </div>
    </Example>
  )
}

function BubbleAlignment() {
  return (
    <Example title="Alignment">
      <div className="flex w-full max-w-md flex-col gap-8">
        <Bubble variant="muted">
          <BubbleContent>This bubble is aligned to the start.</BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>This bubble is aligned to the end.</BubbleContent>
        </Bubble>
        <Bubble variant="muted">
          <BubbleContent>
            This multiline bubble is aligned to the start. The corners should
            adjust when the text wraps to show the grouped side of the
            conversation.
          </BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>
            This multiline bubble is aligned to the end. It should sit on the
            opposite side with the matching corner radius for wrapped text.
          </BubbleContent>
        </Bubble>
      </div>
    </Example>
  )
}

const quickReplies = [
  {
    label: "I need help with my account.",
    message: "I need help with my account.",
  },
  {
    label: "I forgot my password.",
    message: "I forgot my password.",
  },
  {
    label:
      "I have another question. I'd like to talk to a human. Can you help me?",
    message: "I have another question.",
  },
]

function BubbleButtonLinks() {
  return (
    <Example title="Button & Links">
      <div className="flex w-full max-w-md flex-col gap-8">
        <Bubble>
          <BubbleContent asChild>
            <a href="#">This bubble is a link.</a>
          </BubbleContent>
        </Bubble>
        <Bubble variant="secondary">
          <BubbleContent asChild>
            <button type="button">This one is a button you can click.</button>
          </BubbleContent>
        </Bubble>
        <Bubble variant="muted">
          <BubbleContent asChild>
            <button type="button">
              You can also do tinted buttons. Even ones that are multilines.
            </button>
          </BubbleContent>
        </Bubble>
        <Marker variant="separator">
          <MarkerContent>Chat Suggestions</MarkerContent>
        </Marker>
        <Bubble>
          <BubbleContent>How can I help you today?</BubbleContent>
        </Bubble>
        <BubbleGroup>
          {quickReplies.map((reply) => (
            <Bubble key={reply.label} variant="outline" align="end">
              <BubbleContent asChild className="border-dashed border-primary">
                <button type="button" onClick={() => toast(reply.message)}>
                  {reply.label}
                </button>
              </BubbleContent>
            </Bubble>
          ))}
        </BubbleGroup>
      </div>
    </Example>
  )
}
