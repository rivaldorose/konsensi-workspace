import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ContractsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Contracts</h1>
        <p className="text-grey-600 mt-2">Contract beheer</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contracts Overzicht</CardTitle>
          <CardDescription>Alle contracts in je workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Nog geen contracts toegevoegd</p>
        </CardContent>
      </Card>
    </div>
  )
}

