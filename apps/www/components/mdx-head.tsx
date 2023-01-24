import { allDocuments } from "contentlayer/generated"
import * as z from "zod"

import { siteConfig } from "@/config/site"
import { absoluteUrl } from "@/lib/utils"
import { ogImageSchema } from "@/lib/validations/og"

interface MdxHeadProps {
  params: {
    slug?: string[]
  }
  og?: z.infer<typeof ogImageSchema>
}

export default function MdxHead({ params, og }: MdxHeadProps) {
  const slug = params?.slug?.join("/") || ""
  const mdxDoc = allDocuments.find((doc) => doc.slugAsParams === slug)

  if (!mdxDoc) {
    return null
  }

  const title = `${mdxDoc.title} - ${siteConfig.name}`
  const url = process.env.NEXT_PUBLIC_APP_URL
  const ogUrl = new URL(`${url}/og.jpg`)

  const ogTitle = og?.heading || mdxDoc.title
  const ogDescription = mdxDoc.description || siteConfig.description

  return (
    <>
      <title>{title}</title>
      <link rel="canonical" href={absoluteUrl(mdxDoc.slug)} />
      <meta name="description" content={ogDescription} />
      <meta charSet="utf-8" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogUrl.toString()} />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta name="twitter:image" content={ogUrl.toString()} />
    </>
  )
}
