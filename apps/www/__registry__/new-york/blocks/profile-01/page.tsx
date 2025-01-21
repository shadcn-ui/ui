import type { JSX } from "react"
import Image from "next/image"

import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"

export default function Page(): JSX.Element {
  return (
    <header className="border-b border-border">
      <div className="container flex items-center justify-between py-3">
        <span className="text-lg font-extrabold">Acme Inc</span>
        <nav className="flex items-center space-x-4 text-foreground/80 ">
          <a
            href="/about"
            className="text-sm font-medium transition-colors duration-200 ease-in-out hover:text-foreground"
          >
            About
          </a>
          <a
            href="/contact"
            className="text-sm font-medium transition-colors duration-200 ease-in-out hover:text-foreground"
          >
            Contact
          </a>
        </nav>

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
