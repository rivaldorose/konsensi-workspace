import { MainLayout } from '@/components/layout/MainLayout'

export default function RoadmapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}

