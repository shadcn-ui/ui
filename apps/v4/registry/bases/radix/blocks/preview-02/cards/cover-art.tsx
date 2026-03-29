import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/registry/bases/radix/ui/card"
import { Label } from "@/registry/bases/radix/ui/label"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function CoverArt() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <Label
          htmlFor="cover-art"
          className="text-center text-xs tracking-wider text-muted-foreground uppercase font-normal"
        >
          Cover Art
        </Label>
        <label htmlFor="cover-art" className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-dashed bg-muted">
          <IconPlaceholder
            lucide="ImageIcon"
            tabler="IconPhoto"
            hugeicons="Image01Icon"
            phosphor="ImageIcon"
            remixicon="RiImageLine"
            className="size-10 text-muted-foreground/50"
          />
        </label>
        <input id="cover-art" type="file" accept="image/jpeg,image/png" className="sr-only" />
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button variant="secondary" className="w-full" asChild>
          <label htmlFor="cover-art" className="cursor-pointer">
            Upload Artwork
          </label>
        </Button>
        <CardDescription className="text-center">
          Minimum 3000 × 3000px
          <br />
          JPEG or PNG only
        </CardDescription>
      </CardFooter>
    </Card>
  )
}
