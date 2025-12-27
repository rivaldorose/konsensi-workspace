import { MainLayout } from '@/components/layout/MainLayout'

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}

