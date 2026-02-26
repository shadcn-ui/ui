module Link = {
  type props = {
    href: string,
    className?: string,
    children?: React.element,
  }

  @module("next/link")
  external make: React.component<props> = "default"
}
