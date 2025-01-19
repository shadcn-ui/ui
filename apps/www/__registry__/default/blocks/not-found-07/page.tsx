import { NotFound } from "@/registry/default/blocks/not-found-07/components/not-found"

export default function Page() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <NotFound />
    </div>
  )
}
