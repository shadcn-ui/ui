"use client"

import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"

export function ToastWithPromise() {
  const { toast } = useToast()

  const handleToast = async () => {
    const progress = toast({
      title: "Sending...",
      description: "Your message is being sent.",
    })
    await promiseThatMightReject()
      .then(() => {
        progress.update({
          title: "Success",
          description: "Message sent.",
        })
      })
      .catch(() => {
        progress.update({
          title: "Error",
          description: "Failed to send message.",
          variant: "destructive",
        })
      })
  }

  return (
    <Button variant="outline" onClick={handleToast}>
      Trigger promise that might reject
    </Button>
  )
}

function promiseThatMightReject() {
  return new Promise((res, rej) =>
    setTimeout(Math.random() < 0.5 ? res : rej, 2000)
  )
}
