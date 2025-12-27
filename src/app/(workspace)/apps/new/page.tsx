import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewAppPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Nieuwe App</h1>
        <p className="text-grey-600 mt-2">Voeg een nieuwe app toe aan je workspace</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>App Details</CardTitle>
          <CardDescription>Vul de details van je nieuwe app in</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Formulier komt hier</p>
        </CardContent>
      </Card>
    </div>
  )
}

