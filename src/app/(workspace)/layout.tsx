import { Navbar } from '@/components/layout/Navbar'

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Navbar />
      {children}
    </div>
  )
}

