'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/hooks/useApps'
import { AppHeader } from '@/components/apps/AppHeader'
import { AppInfoCard } from '@/components/apps/AppInfoCard'
import { AppMetrics } from '@/components/apps/AppMetrics'
import { AppTabs } from '@/components/apps/AppTabs'
import { OverviewTab } from '@/components/apps/OverviewTab'
import { DetailsTab } from '@/components/apps/DetailsTab'
import { TeamTab } from '@/components/apps/TeamTab'
import { AnalyticsTab } from '@/components/apps/AnalyticsTab'
import { ActivityTab } from '@/components/apps/ActivityTab'

export default function AppDetailPage() {
  const params = useParams()
  const appId = params.id as string
  const { data: app, isLoading } = useApp(appId)
  const [activeTab, setActiveTab] = useState('overview')

  if (isLoading) {
    return (
      <div className="flex-1 pt-16">
        <main className="flex-1 flex flex-col w-full max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 py-8">
          <div className="animate-pulse text-gray-400">Loading app...</div>
        </main>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="flex-1 pt-16">
        <main className="flex-1 flex flex-col w-full max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 py-8">
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">App not found</p>
            <Link href="/apps" className="text-primary hover:underline">
              Back to Apps
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex-1 pt-16">
      <main className="flex-1 flex flex-col w-full max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 py-8 gap-8">
        <AppHeader appId={app.id} />
        <AppInfoCard app={app} />
        <AppMetrics app={app} />
        <AppTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === 'overview' && <OverviewTab app={app} />}
        {activeTab === 'details' && <DetailsTab app={app} />}
        {activeTab === 'team' && <TeamTab appId={app.id} />}
        {activeTab === 'analytics' && <AnalyticsTab appId={app.id} />}
        {activeTab === 'activity' && <ActivityTab appId={app.id} />}
      </main>
    </div>
  )
}
