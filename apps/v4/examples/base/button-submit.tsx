"use client"

import React from "react"

import { Button } from "@/styles/base-nova/ui/button"

export default function Home() {
  const [loading, setLoading] = React.useState(false)

  function onHandleClick() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }
  return (
    <Button onClick={onHandleClick} loading={loading} variant="submit">
      {loading ? "Submitting..." : "Submit"}
    </Button>
  )
}
