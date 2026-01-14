import { Button } from "@/examples/base/ui/button"
import { ArrowRightIcon } from "lucide-react"

export function ButtonIconOnly() {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="icon-xs">
          <ArrowRightIcon />
        </Button>
        <Button size="icon-xs" variant="secondary">
          <ArrowRightIcon />
        </Button>
        <Button size="icon-xs" variant="outline">
          <ArrowRightIcon />
        </Button>
        <Button size="icon-xs" variant="ghost">
          <ArrowRightIcon />
        </Button>
        <Button size="icon-xs" variant="destructive">
          <ArrowRightIcon />
        </Button>
        <Button size="icon-xs" variant="link">
          <ArrowRightIcon />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="icon-sm">
          <ArrowRightIcon />
        </Button>
        <Button size="icon-sm" variant="secondary">
          <ArrowRightIcon />
        </Button>
        <Button size="icon-sm" variant="outline">
          <ArrowRightIcon />
        </Button>
        <Button size="icon-sm" variant="ghost">
          <ArrowRightIcon />
        </Button>
        <Button size="icon-sm" variant="destructive">
          <ArrowRightIcon />
        </Button>
        <Button size="icon-sm" variant="link">
          <ArrowRightIcon />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="icon">
          <ArrowRightIcon />
        </Button>
        <Button size="icon" variant="secondary">
          <ArrowRightIcon />
        </Button>
        <Button size="icon" variant="outline">
          <ArrowRightIcon />
        </Button>
        <Button size="icon" variant="ghost">
          <ArrowRightIcon />
        </Button>
        <Button size="icon" variant="destructive">
          <ArrowRightIcon />
        </Button>
        <Button size="icon" variant="link">
          <ArrowRightIcon />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="icon-lg">
          <ArrowRightIcon />
        </Button>
        <Button size="icon-lg" variant="secondary">
          <ArrowRightIcon />
        </Button>
        <Button size="icon-lg" variant="outline">
          <ArrowRightIcon />
        </Button>
        <Button size="icon-lg" variant="ghost">
          <ArrowRightIcon />
        </Button>
        <Button size="icon-lg" variant="destructive">
          <ArrowRightIcon />
        </Button>
        <Button size="icon-lg" variant="link">
          <ArrowRightIcon />
        </Button>
      </div>
    </>
  )
}
