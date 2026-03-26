import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/examples/base/ui/item"
import { Spinner } from "@/examples/base/ui/spinner"

export function SpinnerDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
      <Item variant="muted">
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">Processing payment...</ItemTitle>
        </ItemContent>
        <ItemContent className="flex-none justify-end">
          <span className="text-sm tabular-nums">$100.00</span>
        </ItemContent>
      </Item>
    </div>
  )
}
