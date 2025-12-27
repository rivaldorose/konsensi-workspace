import { MainLayout } from '@/components/layout/MainLayout'

export default function AppsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}

