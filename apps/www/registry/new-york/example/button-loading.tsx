import { ReloadIcon } from "@radix-ui/react-icons"

import { Button } from "@/registry/new-york/ui/button"

export default function ButtonLoading() {
  return (
    <Button disabled>
      <ReloadIcon className="mr-2 size-4 animate-spin" />
      Please wait
    </Button>
  )
}
