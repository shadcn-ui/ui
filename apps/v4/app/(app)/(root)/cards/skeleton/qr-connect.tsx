import { Card, CardContent, CardHeader } from "@/styles/base-rhea/ui/card"
import { Skeleton } from "@/styles/base-rhea/ui/skeleton"

export function QrConnect() {
  return (
    <Card>
      <CardContent className="flex justify-center pt-6">
        <Skeleton className="size-44 rounded-xl" />
      </CardContent>
      <CardHeader className="items-center gap-2 text-center">
        <Skeleton className="h-5 w-56 rounded-md" />
        <Skeleton className="h-4 w-64 rounded-md" />
        <Skeleton className="h-4 w-48 rounded-md" />
      </CardHeader>
    </Card>
  )
}
