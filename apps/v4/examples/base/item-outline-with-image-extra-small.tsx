import Image from "next/image"
import { Button } from "@/examples/base/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/examples/base/ui/item"

export function ItemOutlineWithImageExtraSmall() {
  return (
    <>
      <Item variant="outline" size="xs">
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
        </ItemContent>
      </Item>
      <Item variant="outline" size="xs">
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
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            View
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="xs">
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
        </ItemContent>
        <ItemActions>
          <Button size="sm">Download</Button>
        </ItemActions>
      </Item>
    </>
  )
}
