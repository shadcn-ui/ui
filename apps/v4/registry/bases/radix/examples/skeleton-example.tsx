import { Card, CardContent, CardHeader } from "@/registry/bases/radix/ui/card"
import { Skeleton } from "@/registry/bases/radix/ui/skeleton"
import Frame from "@/app/(design)/design/components/frame"

export default function SkeletonExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <SkeletonAvatar />
        <SkeletonCard />
        <SkeletonText />
        <SkeletonForm />
        <SkeletonTable />
      </div>
    </div>
  )
}

function SkeletonAvatar() {
  return (
    <Frame title="Avatar">
      <div className="flex w-full items-center gap-4">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="grid gap-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    </Frame>
  )
}

function SkeletonCard() {
  return (
    <Frame title="Card">
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="aspect-square w-full" />
        </CardContent>
      </Card>
    </Frame>
  )
}

function SkeletonText() {
  return (
    <Frame title="Text">
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </Frame>
  )
}

function SkeletonForm() {
  return (
    <Frame title="Form">
      <div className="flex w-full flex-col gap-7">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
    </Frame>
  )
}

function SkeletonTable() {
  return (
    <Frame title="Table">
      <div className="flex w-full flex-col gap-2">
        <div className="flex gap-4">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </Frame>
  )
}
