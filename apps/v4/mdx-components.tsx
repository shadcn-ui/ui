import * as React from "react"
import Image from "next/image"
import Link from "next/link"

import { source } from "@/lib/source"
import { cn } from "@/lib/utils"
import { Callout } from "@/components/callout"
import { CodeBlockCommand } from "@/components/code-block-command"
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper"
import { CodeTabs } from "@/components/code-tabs"
import { ComponentPreview } from "@/components/component-preview"
import { ComponentSource } from "@/components/component-source"
import { ComponentsList } from "@/components/components-list"
import { CopyButton } from "@/components/copy-button"
import { DirectoryList } from "@/components/directory-list"
import { getIconForLanguageExtension } from "@/components/icons"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/new-york-v4/ui/accordion"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/new-york-v4/ui/alert"
import { AspectRatio } from "@/registry/new-york-v4/ui/aspect-ratio"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Kbd } from "@/registry/new-york-v4/ui/kbd"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs"

function getComponentsFolder() {
  const componentsFolder = source.pageTree.children.find(
    (page) => page.$id === "components"
  )

  if (componentsFolder?.type !== "folder") {
    return null
  }

  return componentsFolder
}

// This is only used on /docs/components/ index page, so default to base.
function ComponentsListWrapper({ variant }: { variant?: "all" | "new" }) {
  const componentsFolder = getComponentsFolder()

  if (!componentsFolder) {
    return null
  }

  return (
    <ComponentsList
      componentsFolder={componentsFolder}
      currentBase="base"
      variant={variant}
    />
  )
}

function getNodeText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map((child) => getNodeText(child)).join("")
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getNodeText(node.props.children)
  }

  return ""
}

function getHeadingId(children: React.ReactNode) {
  const id = getNodeText(children)
    .trim()
    .replace(/\s+/g, "-")
    .replace(/'/g, "")
    .replace(/\?/g, "")
    .toLowerCase()

  return id || undefined
}

function HeadingAnchor({
  id,
  children,
}: {
  id?: string
  children: React.ReactNode
}) {
  if (!id) {
    return children
  }

  return (
    <a className="group no-underline" href={`#${id}`}>
      <span className="underline-offset-4 group-hover:underline">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="ml-2 text-muted-foreground opacity-0 group-hover:opacity-100"
      >
        #
      </span>
    </a>
  )
}

export const mdxComponents = {
  h1: ({ children, id, ...props }: React.ComponentProps<"h1">) => {
    const headingId = id ?? getHeadingId(children)

    return (
      <h1 id={headingId} {...props}>
        <HeadingAnchor id={headingId}>{children}</HeadingAnchor>
      </h1>
    )
  },
  h2: ({ children, id, ...props }: React.ComponentProps<"h2">) => {
    const headingId = id ?? getHeadingId(children)

    return (
      <h2 id={headingId} {...props}>
        <HeadingAnchor id={headingId}>{children}</HeadingAnchor>
      </h2>
    )
  },
  h3: ({ children, id, ...props }: React.ComponentProps<"h3">) => {
    const headingId = id ?? getHeadingId(children)

    return (
      <h3 id={headingId} {...props}>
        <HeadingAnchor id={headingId}>{children}</HeadingAnchor>
      </h3>
    )
  },
  h4: ({ children, id, ...props }: React.ComponentProps<"h4">) => {
    const headingId = id ?? getHeadingId(children)

    return (
      <h4 id={headingId} {...props}>
        <HeadingAnchor id={headingId}>{children}</HeadingAnchor>
      </h4>
    )
  },
  h5: ({ children, id, ...props }: React.ComponentProps<"h5">) => {
    const headingId = id ?? getHeadingId(children)

    return (
      <h5 id={headingId} {...props}>
        <HeadingAnchor id={headingId}>{children}</HeadingAnchor>
      </h5>
    )
  },
  h6: ({ children, id, ...props }: React.ComponentProps<"h6">) => {
    const headingId = id ?? getHeadingId(children)

    return (
      <h6 id={headingId} {...props}>
        <HeadingAnchor id={headingId}>{children}</HeadingAnchor>
      </h6>
    )
  },
  // Typeset tables stay real tables and wrap to fit; wrap them to scroll
  // wide ones horizontally instead.
  table: (props: React.ComponentProps<"table">) => (
    <div className="typeset-scroll scroll-fade-x">
      <table {...props} />
    </div>
  ),
  pre: ({ className, children, ...props }: React.ComponentProps<"pre">) => {
    return (
      <pre
        data-not-typeset
        className={cn(
          "no-scrollbar min-w-0 overflow-x-auto overflow-y-auto overscroll-x-contain overscroll-y-auto px-4 py-3.5 outline-none has-data-highlighted-line:px-0 has-data-line-numbers:px-0 has-data-[slot=tabs]:p-0",
          className
        )}
        {...props}
      >
        {children}
      </pre>
    )
  },
  figcaption: ({
    className,
    children,
    ...props
  }: React.ComponentProps<"figcaption">) => {
    const iconExtension =
      "data-language" in props && typeof props["data-language"] === "string"
        ? getIconForLanguageExtension(props["data-language"])
        : null

    return (
      <figcaption
        className={cn(
          "flex items-center gap-2 text-code-foreground [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70",
          className
        )}
        {...props}
      >
        {iconExtension}
        {children}
      </figcaption>
    )
  },
  code: ({
    className,
    __raw__,
    __src__,
    __npm__,
    __yarn__,
    __pnpm__,
    __bun__,
    ...props
  }: React.ComponentProps<"code"> & {
    __raw__?: string
    __src__?: string
    __npm__?: string
    __yarn__?: string
    __pnpm__?: string
    __bun__?: string
  }) => {
    // Inline Code.
    if (typeof props.children === "string") {
      return <code className={className} {...props} />
    }

    // npm command.
    const isNpmCommand = __npm__ && __yarn__ && __pnpm__ && __bun__
    if (isNpmCommand) {
      return (
        <CodeBlockCommand
          __npm__={__npm__}
          __yarn__={__yarn__}
          __pnpm__={__pnpm__}
          __bun__={__bun__}
        />
      )
    }

    // Default codeblock.
    return (
      <>
        {__raw__ && <CopyButton value={__raw__} src={__src__} />}
        <code {...props} />
      </>
    )
  },
  Step: (props: React.ComponentProps<"h3">) => <h3 {...props} />,
  Steps: ({ className, ...props }: React.ComponentProps<"div">) => (
    <div
      className={cn(
        "steps mb-12 [counter-reset:step] md:ml-4 md:border-l md:pl-8 [&>h3]:step",
        className
      )}
      {...props}
    />
  ),
  Image: ({
    src,
    className,
    width,
    height,
    alt,
    ...props
  }: React.ComponentProps<"img">) => (
    <Image
      className={cn("mt-6 rounded-2xl border", className)}
      src={(src as string) || ""}
      width={Number(width)}
      height={Number(height)}
      alt={alt || ""}
      {...props}
    />
  ),
  Tabs: ({ className, ...props }: React.ComponentProps<typeof Tabs>) => {
    return <Tabs className={cn("relative mt-6 w-full", className)} {...props} />
  },
  TabsList: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsList>) => (
    <TabsList
      className={cn(
        "justify-start gap-4 rounded-none bg-transparent px-0",
        className
      )}
      {...props}
    />
  ),
  TabsTrigger: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsTrigger>) => (
    <TabsTrigger
      className={cn(
        "not-typset rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-3 text-base text-muted-foreground hover:text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none! dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent",
        className
      )}
      {...props}
    />
  ),
  TabsContent: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsContent>) => (
    <TabsContent
      className={cn(
        "relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-medium *:[figure]:first:mt-0 [&>.steps]:mt-6",
        className
      )}
      {...props}
    />
  ),
  Tab: (props: React.ComponentProps<"div">) => <div {...props} />,
  Button: ({ className, ...props }: React.ComponentProps<typeof Button>) => (
    <Button className={cn("not-typeset", className)} {...props} />
  ),
  Callout,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertTitle,
  AlertDescription,
  AspectRatio,
  CodeTabs,
  ComponentPreview,
  ComponentSource,
  CodeCollapsibleWrapper,
  ComponentsList: ComponentsListWrapper,
  DirectoryList,
  Link,
  LinkedCard: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      data-not-typeset
      className={cn(
        "flex w-full flex-col items-center rounded-2xl bg-surface p-6 text-surface-foreground transition-colors hover:bg-surface/80 sm:p-10",
        className
      )}
      {...props}
    />
  ),
  Kbd,
}
