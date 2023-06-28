"use client"

import * as React from "react"
import { Mdx } from "./mdx-components"
import { allDocs } from "contentlayer/generated"

interface FrameworkDocsProps extends React.HTMLAttributes<HTMLDivElement> {
  data: string
}

export function FrameworkDocs({
  ...props
}: FrameworkDocsProps) {
  const frameworkDoc = allDocs.find((doc) => doc.slug === `/docs/frameworks/${props.data}`)

  if (!frameworkDoc) {
    return null
  }

  return (
    <div>
      <Mdx code={frameworkDoc.body.code} />
    </div>
  )
}
