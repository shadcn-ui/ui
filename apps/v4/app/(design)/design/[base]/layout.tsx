export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-slot="layout"
      className="bg-background relative z-10 flex h-svh flex-col overflow-hidden"
    >
      {children}
    </div>
  )
}
