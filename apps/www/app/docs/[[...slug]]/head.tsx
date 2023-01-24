import { allDocs } from "contentlayer/generated"

import MdxHead from "@/components/mdx-head"

interface HeadProps {
  params: {
    slug: string[]
  }
}

export default function Head({ params }: HeadProps) {
  const slug = params?.slug?.join("/") || ""
  const doc = allDocs.find((doc) => doc.slugAsParams === slug)

  if (!doc) {
    return null
  }

  return (
    <MdxHead
      params={params}
      og={{ heading: doc.title, type: doc.title, mode: "light" }}
    />
  )
}
