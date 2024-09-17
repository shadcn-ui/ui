"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

function getFragmentIdentifier() {
  if (typeof window !== "undefined") {
    return window.location.hash
  }
}

export function useFragmentIdentifier() {
  const [fragment, setFragment] = useState(getFragmentIdentifier())
  const [isClient, setIsClient] = useState(false)
  const params = useParams()

  useEffect(() => {
    setIsClient(true)
    setFragment(getFragmentIdentifier())
  }, [params])

  if (isClient) {
    return fragment
  }
}

// Reference: https://github.com/vercel/next.js/discussions/49465#discussioncomment-7968587
