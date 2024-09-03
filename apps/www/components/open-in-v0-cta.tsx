import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york/ui/button"

export function OpenInV0Cta({ className }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group relative flex flex-col gap-2 rounded-lg border p-4 text-sm",
        className
      )}
    >
      <div className="text-balance text-lg font-semibold leading-tight group-hover:underline">
        Bring your components to life with Vercel
      </div>
      <div>Trusted by OpenAI, Replicate, Suno, Pinecone and many more.</div>
      <div>
        Vercel provides tools and infrastructure to deploy apps and features at
        scale.
      </div>
      <Button size="sm" className="mt-2 w-fit">
        Deploy Now
      </Button>
      <Link
        href="https://vercel.com/signup?utm_source=shad&utm_medium=web&utm_campaign=docs_cta_signup"
        target="_blank"
        rel="noreferrer"
        className="absolute inset-0"
      >
        <span className="sr-only">Deploy to Vercel</span>
      </Link>
    </div>
  )
}
