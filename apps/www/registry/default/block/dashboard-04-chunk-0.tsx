import Link from "next/link"

export default function Component() {
  return (
    <nav
      className="grid gap-4 text-sm text-muted-foreground"
      x-chunk="dashboard-04-chunk-0"
    >
      <Link href="#" className="font-semibold text-primary">
        General
      </Link>
      <Link href="#">Security</Link>
      <Link href="#">Integrations</Link>
      <Link href="#">Support</Link>
      <Link href="#">Organizations</Link>
      <Link href="#">Advanced</Link>
    </nav>
  )
}
