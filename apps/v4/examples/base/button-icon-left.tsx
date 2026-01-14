import { Button } from "@/examples/base/ui/button"
import { ArrowLeftCircleIcon } from "lucide-react"

export function ButtonIconLeft() {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs">
          <ArrowLeftCircleIcon /> Default
        </Button>
        <Button size="xs" variant="secondary">
          <ArrowLeftCircleIcon /> Secondary
        </Button>
        <Button size="xs" variant="outline">
          <ArrowLeftCircleIcon /> Outline
        </Button>
        <Button size="xs" variant="ghost">
          <ArrowLeftCircleIcon /> Ghost
        </Button>
        <Button size="xs" variant="destructive">
          <ArrowLeftCircleIcon /> Destructive
        </Button>
        <Button size="xs" variant="link">
          <ArrowLeftCircleIcon /> Link
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">
          <ArrowLeftCircleIcon /> Default
        </Button>
        <Button size="sm" variant="secondary">
          <ArrowLeftCircleIcon /> Secondary
        </Button>
        <Button size="sm" variant="outline">
          <ArrowLeftCircleIcon /> Outline
        </Button>
        <Button size="sm" variant="ghost">
          <ArrowLeftCircleIcon /> Ghost
        </Button>
        <Button size="sm" variant="destructive">
          <ArrowLeftCircleIcon /> Destructive
        </Button>
        <Button size="sm" variant="link">
          <ArrowLeftCircleIcon /> Link
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button>
          <ArrowLeftCircleIcon /> Default
        </Button>
        <Button variant="secondary">
          <ArrowLeftCircleIcon /> Secondary
        </Button>
        <Button variant="outline">
          <ArrowLeftCircleIcon /> Outline
        </Button>
        <Button variant="ghost">
          <ArrowLeftCircleIcon /> Ghost
        </Button>
        <Button variant="destructive">
          <ArrowLeftCircleIcon /> Destructive
        </Button>
        <Button variant="link">
          <ArrowLeftCircleIcon /> Link
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="lg">
          <ArrowLeftCircleIcon /> Default
        </Button>
        <Button size="lg" variant="secondary">
          <ArrowLeftCircleIcon /> Secondary
        </Button>
        <Button size="lg" variant="outline">
          <ArrowLeftCircleIcon /> Outline
        </Button>
        <Button size="lg" variant="ghost">
          <ArrowLeftCircleIcon /> Ghost
        </Button>
        <Button size="lg" variant="destructive">
          <ArrowLeftCircleIcon /> Destructive
        </Button>
        <Button size="lg" variant="link">
          <ArrowLeftCircleIcon /> Link
        </Button>
      </div>
    </>
  )
}
