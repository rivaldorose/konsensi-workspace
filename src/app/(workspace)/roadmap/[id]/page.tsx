import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function RoadmapDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Roadmap Item</h1>
        <p className="text-grey-600 mt-2">Roadmap ID: {params.id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roadmap Details</CardTitle>
          <CardDescription>Details van dit roadmap item</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Roadmap details worden hier getoond</p>
        </CardContent>
      </Card>
    </div>
  )
}

