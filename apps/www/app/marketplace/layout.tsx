import { headers } from "next/headers";

interface MarketplaceLayoutProps {
  children: React.ReactNode
}

export default function MarketplaceLayout({ children }: MarketplaceLayoutProps) {
  return (
    <>
        {children}
    </>
  )
}
