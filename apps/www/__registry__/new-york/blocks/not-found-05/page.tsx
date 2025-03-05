import { Illustration } from "@/registry/new-york/blocks/not-found-05/components/illustration"
import { NotFound } from "@/registry/new-york/blocks/not-found-05/components/not-found"

export default function Page() {
  return (
    <div className="relative flex flex-col justify-center min-h-svh gap-6 bg-background p-6 md:p-10 max-w-5xl mx-auto">
      <div className="relative">
        <Illustration className="absolute inset-0 opacity-75 text-muted" />
        <NotFound />
      </div>
    </div>
  )
}
