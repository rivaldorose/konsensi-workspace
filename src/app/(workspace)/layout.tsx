import { Navbar } from '@/components/layout/Navbar'

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background-light">
      <Navbar />
      
      {/* Main content - with padding-top to account for fixed navbar */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}

