import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function EventDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Event Details</h1>
        <p className="text-grey-600 mt-2">Event ID: {params.id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Informatie</CardTitle>
          <CardDescription>Details van dit event</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Event details worden hier getoond</p>
        </CardContent>
      </Card>
    </div>
  )
}

