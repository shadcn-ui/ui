import { Card } from "@/styles/base-rhea/ui/card"
import { Skeleton } from "@/styles/base-rhea/ui/skeleton"

const groupA = [0, 1, 2, 3, 4]
const groupB = [0, 1, 2, 3, 4]

function NavSkeleton({ groups }: { groups: number[][] }) {
  return (
    <div className="flex flex-col gap-1 p-2">
      {groups.map((items, gi) => (
        <div key={gi} className="flex flex-col gap-1 px-2 py-1.5">
          <Skeleton className="mb-1 h-3 w-20 rounded-md" />
          {items.map((item) => (
            <div key={item} className="flex items-center gap-2 px-2 py-2">
              <Skeleton className="size-4 rounded-md" />
              <Skeleton className="h-3 w-24 rounded-md" />
            </div>
          ))}
          {gi < groups.length - 1 && (
            <Skeleton className="my-1 h-px w-full rounded-none" />
          )}
        </div>
      ))}
    </div>
  )
}

export function SidebarNav() {
  return (
    <div className="grid w-full items-start gap-4 xl:grid-cols-2 xl:gap-6">
      <Card className="w-full overflow-hidden rounded-3xl py-0">
        <NavSkeleton groups={[groupA, groupB]} />
      </Card>
      <Card className="hidden w-full overflow-hidden rounded-3xl py-0 xl:flex">
        <NavSkeleton groups={[groupA, groupB]} />
      </Card>
    </div>
  )
}
