import { NotFound } from "@/registry/new-york/blocks/not-found-01/components/not-found"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <NotFound />
    </div>
  )
}
