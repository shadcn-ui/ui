"use client"

import { Command, Fingerprint } from "lucide-react"

import { Workspace } from "../types"

export const workspaces: Workspace[] = [
  {
    id: "33e6e64f-f54a-458a-8ec9-f4851df4b165",
    name: "Acme Inc",
    icon: Command,
  },
  {
    id: "b34336ec-bc12-4520-a112-ccd28c4853e8",
    name: "OpenAI",
    icon: Fingerprint,
  },
]
