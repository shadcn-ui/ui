import { Feed } from "@/registry/new-york/blocks/feed-01/components/feed"

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="mx-auto w-full max-w-lg px-6">
        <Feed />
      </div>
    </div>
  )
}
