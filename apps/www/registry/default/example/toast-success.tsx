"use client"

import { Button } from "@/registry/default/ui/button"
import { ToastAction } from "@/registry/default/ui/toast"
import { useToast } from "@/registry/default/ui/use-toast"

export default function ToastSuccess() {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          variant: "success",
          title: "Success!",
          description: "Your request has been processed successfully.",
          action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
        })
      }}
    >
      Show Toast
    </Button>
  )
}
