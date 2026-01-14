import Image from "next/image"
import { Button } from "@/examples/radix/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/examples/radix/ui/item"

export function ItemDefaultWithImage() {
  return (
    <>
      <Item>
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Project"
            alt="Project"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Project Dashboard</ItemTitle>
          <ItemDescription>
            Overview of project settings and configuration.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item>
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Document"
            alt="Document"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Document</ItemTitle>
          <ItemDescription>A document with metadata displayed.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            View
          </Button>
        </ItemActions>
      </Item>
      <Item>
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/File"
            alt="File"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>File Attachment</ItemTitle>
          <ItemDescription>
            Complete file with image, title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Download</Button>
        </ItemActions>
      </Item>
    </>
  )
}
