import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Nieuw Event</h1>
        <p className="text-grey-600 mt-2">Voeg een nieuw event toe</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Vul de details van het event in</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Formulier komt hier</p>
        </CardContent>
      </Card>
    </div>
  )
}

