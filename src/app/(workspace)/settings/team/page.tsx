import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TeamSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Team Settings</h1>
        <p className="text-grey-600 mt-2">Beheer teamleden</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Leden</CardTitle>
          <CardDescription>Beheer alle teamleden</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Team lijst komt hier</p>
        </CardContent>
      </Card>
    </div>
  )
}

