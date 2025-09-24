import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/registry/new-york-v4/ui/item"
import { Spinner } from "@/registry/new-york-v4/ui/spinner"

export default function SpinnerDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4 [--radius:1rem]">
      <Item variant="muted">
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Processing payment...</ItemTitle>
        </ItemContent>
      </Item>
    </div>
  )
}
