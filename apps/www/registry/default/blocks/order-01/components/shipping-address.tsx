import type { JSX } from "react"
import { Pencil } from "lucide-react"

import { Button } from "@/registry/default/ui/button"

interface ShippingAddressProps {
  addressType: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export default function ShippingAddress({
  address,
  addressType,
  city,
  country,
  name,
  state,
  zipCode,
}: Readonly<ShippingAddressProps>): JSX.Element {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Shipping Address ({addressType})
        </h3>
        <Button size="icon" variant="ghost">
          <Pencil />
        </Button>
      </div>

      <div className="text-sm text-foreground/80">
        <p>{name}</p>
        <p>{address}</p>
        <p>
          {city}, {state} {zipCode}
        </p>
        <p>{country}</p>
      </div>
    </div>
  )
}
