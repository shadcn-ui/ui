"use client"

import { useToast } from "@/registry/default/hooks/use-toast"
import { Button } from "@/registry/default/ui/button"
import { ToastAction } from "@/registry/default/ui/toast"

export default function ToastSuccess() {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          variant: "success",
          title: "Success!",
          description: "Your action was successful.",
          action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
        })
      }}
    >
      Show Success Toast
    </Button>
  )
}
