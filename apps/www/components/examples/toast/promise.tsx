"use client"

import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"

export function ToastWithPromise() {
  const { toast } = useToast()

  const handleToast = async () => {
    const progress = toast({
      title: "Saving...",
      description: "Your message is being sent.",
    })
    await new Promise((resolve) => setTimeout(resolve, 2000))
    progress.update({
      title: "Error",
      description: "Failed to send message.",
      variant: "destructive",
    })
  }

  return (
    <Button variant="outline" onClick={handleToast}>
      Show Toast
    </Button>
  )
}
