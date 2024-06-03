import { ReloadIcon } from "@radix-ui/react-icons"

import { Button } from "@/registry/new-york/ui/button"

export default function ButtonLoading() {
  return (
    <div className="cursor-progress">
      <Button disabled>
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin " />
        Please wait
      </Button>
    </div>
  )
}
