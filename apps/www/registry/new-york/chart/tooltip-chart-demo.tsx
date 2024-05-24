export default function Component() {
  return (
    <div className="grid grid-cols-2 items-start justify-center gap-6">
      <div className="grid items-start gap-4">
        <div className="flex w-[140px] items-center gap-2 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-sm">
          <div className="h-[1.8rem] w-1 rounded-full bg-blue-500" />
          <div className="flex w-full flex-col gap-0.5">
            <div className="font-medium">Visitors</div>
            <div className="flex w-full items-center text-muted-foreground">
              Desktop
              <div className="ml-auto font-mono font-medium text-foreground">
                1,203
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-[140px] items-center gap-2 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-sm">
          <div className="flex w-full flex-col gap-0.5">
            <div className="flex w-full items-center gap-1 text-muted-foreground">
              Mobile
              <div className="ml-auto font-mono font-medium text-foreground">
                2,450
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-[140px] items-center gap-2 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-sm">
          <div className="flex w-full flex-col gap-0.5">
            <div className="flex w-full items-center gap-1 text-muted-foreground">
              <div className="size-2 rounded-[2px] bg-blue-500" />
              1,203
              <div className="ml-auto font-mono font-medium text-foreground">
                Desktop
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid items-start gap-4">
        <div className="flex w-[140px] items-center gap-2 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-sm">
          <div className="flex w-full flex-col gap-0.5">
            <div className="-mx-2.5 mb-1 border-b px-2 pb-1.5 font-medium">
              Visitors
            </div>
            <div className="flex w-full items-center gap-1 text-muted-foreground">
              <div className="size-[0.4rem] rounded-sm bg-primary" />
              Desktop
              <div className="ml-auto font-mono font-medium text-foreground">
                1,203
              </div>
            </div>
            <div className="flex w-full items-center gap-1 text-muted-foreground">
              <div className="size-[0.4rem] rounded-sm bg-blue-500" />
              Mobile
              <div className="ml-auto font-mono font-medium text-foreground">
                357
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-[140px] items-center gap-2 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-sm">
          <div className="flex w-full flex-col gap-0.5">
            <div className="flex w-full items-center gap-1 text-muted-foreground">
              <div className="size-[0.4rem] rounded-sm bg-blue-500" />
              Desktop
              <div className="ml-auto font-mono font-medium text-foreground">
                1,203
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
