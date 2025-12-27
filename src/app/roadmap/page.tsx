import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function RoadmapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Roadmap</h1>
        <p className="text-grey-600 mt-2">Product roadmap planning</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roadmap</CardTitle>
          <CardDescription>Product roadmap overzicht</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Roadmap visualisatie komt hier</p>
        </CardContent>
      </Card>
    </div>
  )
}

