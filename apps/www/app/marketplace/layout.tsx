import { headers } from "next/headers";
import { TRPCReactProvider } from "@/trpc/react";

interface MarketplaceLayoutProps {
  children: React.ReactNode
}

export default function MarketplaceLayout({ children }: MarketplaceLayoutProps) {
  return (
    <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
  )
}
