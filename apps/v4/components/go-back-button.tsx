"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/registry/new-york-v4/ui/button"

interface GoBackButtonProps {
  className?: string
}

export function GoBackButton({ className }: GoBackButtonProps) {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <Button
      variant="link"
      size="sm"
      className={className}
      onClick={handleGoBack}
    >
      <ArrowLeft className="mr-2 h-3 w-3" />
      Go Back
    </Button>
  )
}
