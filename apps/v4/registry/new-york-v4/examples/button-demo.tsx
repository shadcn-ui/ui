import { Button } from "@/registry/new-york-v4/ui/button"

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button>Button</Button>
      <Button color="green">Green</Button>
      <Button color="blue">Blue</Button>
      <Button color="red">Red</Button>
    </div>
  )
}
