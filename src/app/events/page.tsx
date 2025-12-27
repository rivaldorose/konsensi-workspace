import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-500">Events</h1>
          <p className="text-grey-600 mt-2">Beheer alle events en campagnes</p>
        </div>
        <Button asChild>
          <Link href="/events/new">
            <Plus className="h-4 w-4 mr-2" />
            Nieuw Event
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events Overzicht</CardTitle>
          <CardDescription>Alle events in je workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Nog geen events toegevoegd. Maak je eerste event aan!</p>
        </CardContent>
      </Card>
    </div>
  )
}

