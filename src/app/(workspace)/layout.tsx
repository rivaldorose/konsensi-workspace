import { Navbar } from '@/components/layout/Navbar'

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background-light">
      <Navbar />
      
      {/* Main content - navbar is fixed with h-16 (4rem), so children start below it */}
      <main className="pt-16 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  )
}

