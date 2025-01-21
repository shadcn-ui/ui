"use client"

import { useState, type JSX } from "react"

import { Button } from "@/registry/new-york/ui/button"

export default function UserActions(): JSX.Element {
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <div className="mt-4 flex items-center gap-4 md:mt-0">
        <Button variant="secondary">Message</Button>
      <Button
        variant={isFollowing ? "outline" : "secondary"}
        onClick={() => setIsFollowing(!isFollowing)}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
      <Button>Hire</Button>
    </div>
  )
}
