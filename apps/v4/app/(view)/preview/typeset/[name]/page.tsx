import { notFound } from "next/navigation"

import {
  AVAILABLE_CONTENT_OPTIONS,
  FIXTURES,
} from "@/app/(app)/(typeset)/lib/fixtures"
import { CHAT_QUESTION } from "@/app/(app)/(typeset)/lib/fixtures/chat"

export const dynamicParams = false

export function generateStaticParams() {
  return AVAILABLE_CONTENT_OPTIONS.map((option) => ({ name: option.value }))
}

export default async function TypesetFixturePage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params

  if (!AVAILABLE_CONTENT_OPTIONS.some((option) => option.value === name)) {
    notFound()
  }

  const content = (
    <div
      className="typeset w-full"
      dangerouslySetInnerHTML={{
        __html: FIXTURES[name as keyof typeof FIXTURES],
      }}
    />
  )

  if (name === "chat") {
    return (
      <div className="flex w-full flex-col gap-10">
        <div className="ml-auto w-fit max-w-[65%] rounded-3xl bg-muted px-4 py-2.5">
          {CHAT_QUESTION}
        </div>
        {content}
      </div>
    )
  }

  return content
}
