import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function UsageSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Usage Statistics</h1>
        <p className="text-grey-600 mt-2">Gebruiksstatistieken</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gebruik</CardTitle>
          <CardDescription>Overzicht van gebruik en statistieken</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Usage charts komen hier</p>
        </CardContent>
      </Card>
    </div>
  )
}

