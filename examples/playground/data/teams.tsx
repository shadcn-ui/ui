"use client"

import { Workspace } from "@/types"
import { Command, Fingerprint } from "lucide-react"

export const workspaces: Workspace[] = [
  {
    id: "b34336ec-bc12-4520-a112-ccd28c4853e8",
    name: "OpenUI",
    icon: Fingerprint,
  },
  {
    id: "33e6e64f-f54a-458a-8ec9-f4851df4b165",
    name: "Acme Inc",
    icon: Command,
  },
]
