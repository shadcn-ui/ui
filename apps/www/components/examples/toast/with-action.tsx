"use client"

import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"

export function ToastWithAction() {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }}
    >
      Show Toast
    </Button>
  )
}
