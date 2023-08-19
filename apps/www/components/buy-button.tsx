"use client"

import { CurrentUser } from "@/lib/session"
import { Button } from "@/registry/default/ui/button"

export default function BuyButton({
  user,
  children,
}: {
  user: CurrentUser
  children: React.ReactNode
}) {
  return user ? (
    <form action="/api/checkout" method="POST">
      <input type="hidden" name="email" value={user.email!}></input>
      <input type="hidden" name="userId" value={user.id}></input>
      <Button>{children}</Button>
    </form>
  ) : null
}
