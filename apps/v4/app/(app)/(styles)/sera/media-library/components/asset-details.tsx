import {
  DownloadIcon,
  FileTextIcon,
  ImageIcon,
  PlusIcon,
  VideoIcon,
} from "lucide-react"

import { Badge } from "@/styles/base-sera/ui/badge"
import { Button } from "@/styles/base-sera/ui/button"
import { Card, CardContent, CardFooter } from "@/styles/base-sera/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/styles/base-sera/ui/item"
import { Separator } from "@/styles/base-sera/ui/separator"

import { type Asset, type AssetType } from "../data"

const TYPE_LABEL: Record<AssetType, string> = {
  JPEG: "Image / JPEG",
  PNG: "Image / PNG",
  WEBP: "Image / WEBP",
  MP4: "Video / MP4",
  PDF: "Document / PDF",
}

export function AssetDetails({ asset }: { asset: Asset }) {
  return (
    <Card className="gap-0">
      <CardContent className="flex flex-col gap-6">
        <div className="flex aspect-5/4 items-center justify-center bg-muted/60 text-muted-foreground/60 ring-1 ring-border/70 ring-inset">
          {asset.type === "MP4" ? (
            <VideoIcon className="size-8" />
          ) : asset.type === "PDF" ? (
            <FileTextIcon className="size-8" />
          ) : (
            <ImageIcon className="size-8" />
          )}
        </div>
        <h2 className="line-clamp-2 font-heading text-xl tracking-wide">
          {asset.name}
        </h2>
        <Separator />
        <dl className="flex flex-col gap-5 text-sm">
          <div className="flex flex-col gap-1.5">
            <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              Asset Type
            </dt>
            <dd>{TYPE_LABEL[asset.type]}</dd>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Dimensions
              </dt>
              <dd>{asset.dimensions}</dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                File Size
              </dt>
              <dd>{asset.size}</dd>
            </div>
          </div>
        </dl>
        <Separator />
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              Tags
            </h3>
            <Button variant="ghost" size="icon-xs" aria-label="Add tag">
              <PlusIcon />
            </Button>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {asset.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          <h3 className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            Used In
          </h3>
          <div className="flex flex-col gap-2">
            {asset.usedIn.map((usage) => (
              <Item key={usage.title} variant="outline">
                <ItemContent>
                  <ItemTitle>{usage.title}</ItemTitle>
                  <ItemDescription>{usage.role}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-6 border-t pt-6">
        <Button className="w-full">
          <DownloadIcon data-icon="inline-start" />
          Download
        </Button>
      </CardFooter>
    </Card>
  )
}
