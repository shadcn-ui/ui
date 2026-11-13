import { Button } from "@/registry/bases/aria/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/registry/bases/aria/ui/card"
import { Item } from "@/registry/bases/aria/ui/item"
import { Label } from "@/registry/bases/aria/ui/label"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function CoverArt() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <Label
          htmlFor="cover-art"
          className="text-center text-xs font-normal tracking-wider text-muted-foreground uppercase"
        >
          Cover Art
        </Label>
        <Item className="aspect-square" variant="outline">
          <label
            htmlFor="cover-art"
            className="flex size-full cursor-pointer items-center justify-center"
          >
            <IconPlaceholder
              lucide="ImageIcon"
              tabler="IconPhoto"
              hugeicons="Image01Icon"
              phosphor="ImageIcon"
              remixicon="RiImageLine"
              className="size-10 text-muted-foreground/50"
            />
          </label>
        </Item>
        <input
          id="cover-art"
          type="file"
          accept="image/jpeg,image/png"
          className="sr-only"
        />
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <label htmlFor="cover-art" className="w-full">
          <Button variant="secondary" className="w-full">
            Upload Artwork
          </Button>
        </label>
        <CardDescription className="text-center text-xs">
          Minimum 3000 × 3000px
          <br />
          JPEG or PNG only
        </CardDescription>
      </CardFooter>
    </Card>
  )
}
