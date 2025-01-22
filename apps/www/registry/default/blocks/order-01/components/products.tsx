import type { JSX } from "react"
import Image from "next/image"

interface ProductsProps {
  products: {
    image: string
    altImage: string
    name: string
    description: string
    size: string
    color: string
    quantity: number
    price: number
  }[]
}

export default function Products({
  products = [],
}: Readonly<ProductsProps>): JSX.Element {
  return (
    <div className="grid-col-1 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <article key={product.name} className="flex w-fit gap-4 bg-background">
          <Image
            src={product.image}
            alt={product.altImage}
            className="aspect-square rounded-lg"
            width={80}
            height={80}
          />

          <div className="flex flex-col justify-between py-1">
            <div>
              <small className="text-xs text-foreground/80 sm:text-sm">
                {product.name}
              </small>
              <p className="text-sm font-medium leading-none sm:text-base">
                {product.description}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground/80">
              <small>Size: {product.size}</small>•
              <small>Color: {product.color}</small>
            </div>
          </div>

          <p className="flex h-fit items-center gap-1 py-1 text-sm font-medium text-foreground/80">
            {product.quantity}x ${product.price.toLocaleString()}
          </p>
        </article>
      ))}
    </div>
  )
}
