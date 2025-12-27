import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Analytics</h1>
        <p className="text-grey-600 mt-2">Workspace analytics en metrics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>Overzicht van metrics en statistieken</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Analytics charts komen hier</p>
        </CardContent>
      </Card>
    </div>
  )
}

