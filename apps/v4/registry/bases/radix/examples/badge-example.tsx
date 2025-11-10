import { Badge } from "@/registry/bases/radix/ui/badge"
import { CanvaFrame } from "@/app/(design)/design/components/canva"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

export default function BadgeDemo() {
  return (
    <CanvaFrame>
      <div className="flex flex-col items-center gap-2">
        <div className="flex w-full flex-wrap gap-2">
          <Badge>Badge</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="outline">
            <IconPlaceholder
              lucide="CircleDashedIcon"
              tabler="IconCircleDashed"
              hugeicons="DashedLineCircleIcon"
            />
            Badge
          </Badge>
          <Badge variant="destructive">
            <IconPlaceholder
              lucide="CircleDashedIcon"
              tabler="IconCircleDashed"
              hugeicons="DashedLineCircleIcon"
            />
            Alert
          </Badge>
          <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
            8
          </Badge>
          <Badge
            className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
            variant="destructive"
          >
            99
          </Badge>
          <Badge
            className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
            variant="outline"
          >
            20+
          </Badge>
        </div>
        <div className="flex w-full flex-wrap gap-2">
          <Badge asChild>
            <a href="#">
              Link{" "}
              <IconPlaceholder
                lucide="CircleDashedIcon"
                tabler="IconCircleDashed"
                hugeicons="DashedLineCircleIcon"
              />
            </a>
          </Badge>
          <Badge asChild variant="secondary">
            <a href="#">
              Link{" "}
              <IconPlaceholder
                lucide="CircleDashedIcon"
                tabler="IconCircleDashed"
                hugeicons="DashedLineCircleIcon"
              />
            </a>
          </Badge>
          <Badge asChild variant="destructive">
            <a href="#">
              Link{" "}
              <IconPlaceholder
                lucide="CircleDashedIcon"
                tabler="IconCircleDashed"
                hugeicons="DashedLineCircleIcon"
              />
            </a>
          </Badge>
          <Badge asChild variant="outline">
            <a href="#">
              Link{" "}
              <IconPlaceholder
                lucide="CircleDashedIcon"
                tabler="IconCircleDashed"
                hugeicons="DashedLineCircleIcon"
              />
            </a>
          </Badge>
        </div>
      </div>
    </CanvaFrame>
  )
}
