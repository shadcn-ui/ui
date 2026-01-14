import { Progress } from "@/examples/radix/ui/progress"

export function ProgressValues() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Progress value={0} />
      <Progress value={25} className="w-full" />
      <Progress value={50} />
      <Progress value={75} />
      <Progress value={100} />
    </div>
  )
}
