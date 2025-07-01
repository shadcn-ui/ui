import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"

export function OpenInV0Cta({ className }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group bg-surface text-surface-foreground relative flex flex-col gap-2 rounded-lg p-6 text-sm",
        className
      )}
    >
      <div className="text-base leading-tight font-semibold text-balance group-hover:underline">
        Deploy your shadcn/ui app on Vercel
      </div>
      <div className="text-muted-foreground">
        Trusted by OpenAI, Sonos, Adobe, and more.
      </div>
      <div className="text-muted-foreground">
        Vercel provides tools and infrastructure to deploy apps and features at
        scale.
      </div>
      <Button size="sm" className="mt-2 w-fit">
        Deploy Now
      </Button>
      <a
        href="https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout"
        target="_blank"
        rel="noreferrer"
        className="absolute inset-0"
      >
        <span className="sr-only">Deploy to Vercel</span>
      </a>
    </div>
  )
}
