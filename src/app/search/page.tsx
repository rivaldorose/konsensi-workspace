import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Search</h1>
        <p className="text-grey-600 mt-2">Zoek in je workspace</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zoeken</CardTitle>
          <CardDescription>Zoek in apps, partners, events en meer</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Search interface komt hier</p>
        </CardContent>
      </Card>
    </div>
  )
}

