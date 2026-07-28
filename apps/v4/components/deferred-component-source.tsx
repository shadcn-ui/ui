"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper"
import { CopyButton } from "@/components/copy-button"
import { getIconForLanguageExtension } from "@/components/icons"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Spinner } from "@/registry/new-york-v4/ui/spinner"

type RegistryItem = {
  files?: {
    path: string
    content?: string
  }[]
}

const registryItemRequests = new Map<string, Promise<RegistryItem>>()

function getRegistryItem(url: string) {
  const cached = registryItemRequests.get(url)
  if (cached) {
    return cached
  }

  const request = fetch(url).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Could not load source (${response.status})`)
    }

    return (await response.json()) as RegistryItem
  })

  registryItemRequests.set(url, request)
  void request.catch(() => registryItemRequests.delete(url))

  return request
}

// Large manual-install sources stay out of the initial RSC payload and load only
// when their parent tab mounts. One registry request supplies every file.
export function DeferredComponentSource({
  name,
  file,
  title = file,
  styleName,
  className,
}: {
  name: string
  file: string
  title?: string
  styleName: string
  className?: string
}) {
  const [code, setCode] = React.useState<string>()
  const [error, setError] = React.useState<string>()
  const [attempt, setAttempt] = React.useState(0)
  const language = title.split(".").pop() ?? "tsx"

  React.useEffect(() => {
    let cancelled = false
    const url = `/r/styles/${styleName}/${name}.json`

    setError(undefined)
    void getRegistryItem(url)
      .then((item) => {
        if (cancelled) {
          return
        }

        const source = item.files?.find(
          (registryFile) =>
            registryFile.path === file || registryFile.path.endsWith(`/${file}`)
        )?.content

        if (!source) {
          throw new Error(`Could not find ${file} in ${name}`)
        }

        setCode(source)
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setError(
            cause instanceof Error ? cause.message : "Could not load source"
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [attempt, file, name, styleName])

  if (!code) {
    return (
      <figure
        data-rehype-pretty-code-figure=""
        className={cn("min-h-32", className)}
      >
        <SourceTitle language={language} title={title} />
        <div
          role="status"
          aria-busy={!error}
          className="flex min-h-24 items-center justify-center gap-2 px-4 py-6 text-sm text-muted-foreground"
        >
          {error ? (
            <>
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAttempt((value) => value + 1)}
              >
                Retry
              </Button>
            </>
          ) : (
            <>
              <Spinner aria-hidden="true" />
              <span>Loading {title}</span>
            </>
          )}
        </div>
      </figure>
    )
  }

  return (
    <CodeCollapsibleWrapper className={className}>
      <figure data-rehype-pretty-code-figure="" className="[&>pre]:max-h-96">
        <SourceTitle language={language} title={title} />
        <CopyButton value={code} />
        <pre
          data-language={language}
          data-not-typeset
          className="no-scrollbar min-w-0 overflow-x-auto overflow-y-auto overscroll-x-contain overscroll-y-auto bg-transparent px-4 py-3.5 outline-none"
        >
          <code
            data-language={language}
            className="block min-w-full border-0 bg-transparent p-0 font-mono text-sm whitespace-pre"
          >
            {code}
          </code>
        </pre>
      </figure>
    </CodeCollapsibleWrapper>
  )
}

function SourceTitle({ language, title }: { language: string; title: string }) {
  return (
    <figcaption
      data-rehype-pretty-code-title=""
      className="flex items-center gap-2 text-code-foreground [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70"
      data-language={language}
    >
      {getIconForLanguageExtension(language)}
      {title}
    </figcaption>
  )
}
