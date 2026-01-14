import { Button } from "@/examples/radix/ui/button"
import { ArrowRightIcon } from "lucide-react"

export function ButtonIconRight() {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs">
          Default <ArrowRightIcon />
        </Button>
        <Button size="xs" variant="secondary">
          Secondary <ArrowRightIcon />
        </Button>
        <Button size="xs" variant="outline">
          Outline <ArrowRightIcon />
        </Button>
        <Button size="xs" variant="ghost">
          Ghost <ArrowRightIcon />
        </Button>
        <Button size="xs" variant="destructive">
          Destructive <ArrowRightIcon />
        </Button>
        <Button size="xs" variant="link">
          Link <ArrowRightIcon />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">
          Default
          <ArrowRightIcon />
        </Button>
        <Button size="sm" variant="secondary">
          Secondary <ArrowRightIcon />
        </Button>
        <Button size="sm" variant="outline">
          Outline <ArrowRightIcon />
        </Button>
        <Button size="sm" variant="ghost">
          Ghost <ArrowRightIcon />
        </Button>
        <Button size="sm" variant="destructive">
          Destructive <ArrowRightIcon />
        </Button>
        <Button size="sm" variant="link">
          Link <ArrowRightIcon />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button>
          Default <ArrowRightIcon />
        </Button>
        <Button variant="secondary">
          Secondary <ArrowRightIcon />
        </Button>
        <Button variant="outline">
          Outline <ArrowRightIcon />
        </Button>
        <Button variant="ghost">
          Ghost <ArrowRightIcon />
        </Button>
        <Button variant="destructive">
          Destructive <ArrowRightIcon />
        </Button>
        <Button variant="link">
          Link <ArrowRightIcon />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="lg">
          Default <ArrowRightIcon />
        </Button>
        <Button size="lg" variant="secondary">
          Secondary <ArrowRightIcon />
        </Button>
        <Button size="lg" variant="outline">
          Outline <ArrowRightIcon />
        </Button>
        <Button size="lg" variant="ghost">
          Ghost <ArrowRightIcon />
        </Button>
        <Button size="lg" variant="destructive">
          Destructive <ArrowRightIcon />
        </Button>
        <Button size="lg" variant="link">
          Link <ArrowRightIcon />
        </Button>
      </div>
    </>
  )
}
