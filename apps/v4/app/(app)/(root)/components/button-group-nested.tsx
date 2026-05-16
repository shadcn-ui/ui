"use client"

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { Button } from "@/styles/radix-nova/ui/button"
import { ButtonGroup } from "@/styles/radix-nova/ui/button-group"

export function ButtonGroupNested() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon-sm" aria-label="Previous">
          <ArrowLeftIcon />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Next">
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}
