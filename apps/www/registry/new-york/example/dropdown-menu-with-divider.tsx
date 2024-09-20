"use client"

import * as React from "react"

import { Button } from "@/registry/sydney/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/sydney/ui/dropdown-menu"

export function DropdownMenuwithDividers() {
  const [selectedCar, setSelectedCar] = React.useState("Select a car")

  const handleCarSelect = (car) => {
    setSelectedCar(car)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{selectedCar}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Chinese Cars</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={selectedCar === "BYD"}
          onCheckedChange={() => handleCarSelect("BYD")}
        >
          BYD
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedCar === "GWM"}
          onCheckedChange={() => handleCarSelect("GWM")}
        >
          GWM
        </DropdownMenuCheckboxItem>
        <DropdownMenuLabel>German Cars</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={selectedCar === "Mercedes"}
          onCheckedChange={() => handleCarSelect("Mercedes")}
        >
          Mercedes
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedCar === "Audi"}
          onCheckedChange={() => handleCarSelect("Audi")}
        >
          Audi
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownMenuwithDividers
