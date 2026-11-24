/**
 * Copyright (c) Acme.
 * SPDX-License-Identifier: MIT
 */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
