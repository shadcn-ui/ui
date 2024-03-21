"use client"

import { Button } from "@/registry/default/ui/button"
import { ToastAction } from "@/registry/default/ui/toast"
import { useToast } from "@/registry/default/ui/use-toast"

export default function ToastInformative() {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          variant: "informative",
          title: "This is an informative toast",
          description: "We have some information for you.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }}
    >
      Show Toast
    </Button>
  )
}
