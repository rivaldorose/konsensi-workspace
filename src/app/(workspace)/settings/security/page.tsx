import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Security Settings</h1>
        <p className="text-grey-600 mt-2">Beveiligingsinstellingen</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Beveiliging</CardTitle>
          <CardDescription>Beheer je beveiligingsinstellingen</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Security instellingen komen hier</p>
        </CardContent>
      </Card>
    </div>
  )
}

