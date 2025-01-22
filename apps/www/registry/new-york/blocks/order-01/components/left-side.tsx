import { memo, type JSX } from "react"
import Image from "next/image"
import {
  Banknote,
  Package,
  PackageCheck,
  Pencil,
  Plane,
  Truck,
} from "lucide-react"

import { Button } from "@/registry/new-york/ui/button"
import { Separator } from "@/registry/new-york/ui/separator"

import OrderState from "./order-state"
import Products from "./products"
import ShippingAddress from "./shipping-address"
import OrderSummary from './order-summary';

const states = [
  {
    status: "Created",
    icon: <Package size={22} />,
    description: "Created successfully",
    isActive: false,
  },
  {
    status: "Paid",
    icon: <Banknote size={22} />,
    description: "Payment confirmed",
    isActive: false,
  },
  {
    status: "Shipped",
    icon: <Plane size={22} />,
    description: "Shipped to destination",
    isActive: false,
  },
  {
    status: "Out for delivery",
    icon: <Truck size={22} />,
    description: "On the way to the buyer",
    isActive: false,
  },
  {
    status: "Delivered",
    icon: <PackageCheck size={22} />,
    description: "Delivered successfully",
    isActive: true,
  },
]

const buyerAddress = {
  addressType: "Buyer",
  name: "Shadcn Inc",
  address: "5th Floor, 1234 Main St",
  city: "Springfield",
  state: "IL",
  zipCode: "62701",
  country: "United States",
}

const sellerAddress = {
  addressType: "Seller",
  name: "Shadcn Inc",
  address: "5th Floor, 1234 Main St",
  city: "Springfield",
  state: "IL",
  zipCode: "62701",
  country: "United States",
}

const products = [
  {
    image: "/placeholder.svg",
    altImage: "Product Image",
    name: "Laptop",
    description: "Macbook Pro",
    size: "M",
    color: "Black",
    quantity: 1,
    price: 1900,
  },
  {
    image: "/placeholder.svg",
    altImage: "Product Image",
    name: "Headphones",
    description: "Airpods",
    size: "M",
    color: "Black",
    quantity: 3,
    price: 150,
  },
  {
    image: "/placeholder.svg",
    altImage: "Product Image",
    name: "Phone",
    description: "iPhone 15 Pro",
    size: "M",
    color: "Black",
    quantity: 2,
    price: 800,
  },
]

  const orderItems = [
    {
      name: "Macbook Pro",
      color: "Black",
      size: "M",
      price: 1900,
      quantity: 1,
    },
    {
      name: "Airpods",
      color: "Black",
      size: "XL",
      price: 150,
      quantity: 3,
    },
    {
      name: "iPhone 13",
      color: "Black",
      size: "M",
      price: 800,
      quantity: 2,
    }
  ]

export const LeftSide = memo((): JSX.Element => {
  return (
    <div className="w-full py-4 xl:w-3/4 xl:pr-4">
      <h3 className="mb-4 text-lg font-semibold">Order Status</h3>

      <OrderState states={states} />

      <Separator className="my-6" />

      <div className="grid-col-1 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
        <ShippingAddress {...buyerAddress} />
        <ShippingAddress {...sellerAddress} />
      </div>

      <Separator className="my-6" />

      <h3 className="mb-4 text-lg font-semibold">Order Notes</h3>
      
      <p className='text-sm text-foreground/80'>I will be traveling to the US on the 12th of December and I will be able to receive the package.
        
      </p>


      <Separator className="my-6" />

      <h3 className="mb-4 text-lg font-semibold">Order Items</h3>

      <Products products={products} />

      <Separator className="my-6" />

      <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>

       <OrderSummary items={orderItems} shippingCost={20} shippingDiscount={500} />
    </div>
  )
})

LeftSide.displayName = "LeftSide"
