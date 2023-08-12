import "@/styles/globals.css"

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return <>{children}</>
}
