"use client"

import { Button } from "@/registry/new-york/ui/button"
import { ToastAction } from "@/registry/new-york/ui/toast"
import { useToast } from "@/registry/new-york/ui/use-toast"

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
