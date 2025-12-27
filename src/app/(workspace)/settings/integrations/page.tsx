import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function IntegrationsSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Integrations</h1>
        <p className="text-grey-600 mt-2">Beheer integraties</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Integraties</CardTitle>
          <CardDescription>Beheer alle integraties</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Integraties lijst komt hier</p>
        </CardContent>
      </Card>
    </div>
  )
}

