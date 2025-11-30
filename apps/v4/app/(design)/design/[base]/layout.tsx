export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-slot="layout"
      className="bg-background relative z-10 flex min-h-svh flex-col"
    >
      {children}
    </div>
  )
}
