"use client"

import { useState } from "react"
import { Frame, RotateCcw } from "lucide-react"

import { Button } from "@/registry/default/ui/button"

import { TypingText } from "./typing-text"

export function NotFound() {
  const [key, setKey] = useState(0)

  const handleRerender = () => {
    setKey((prevKey) => prevKey + 1)
  }

  return (
    <>
      <div className="relative flex flex-col items-start w-64">
        <h3 className="text-2xl font-semibold">
          <Frame className="h-6 w-6 mb-2" />
          404 Not Found
        </h3>
        <p className="absolute top-full mt-2 pb-8">
          <TypingText
            key={key}
            text="Found, this link is not. A path to nowhere, it leads. 404, the error is."
          />
        </p>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={handleRerender}
        className="absolute top-8 right-8"
      >
        <RotateCcw />
      </Button>
    </>
  )
}
