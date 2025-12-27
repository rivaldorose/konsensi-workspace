import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function PartnersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-500">Partners</h1>
          <p className="text-grey-600 mt-2">Beheer alle partnerships</p>
        </div>
        <Button asChild>
          <Link href="/partners/new">
            <Plus className="h-4 w-4 mr-2" />
            Nieuwe Partner
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partners Overzicht</CardTitle>
          <CardDescription>Alle partners in je workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Nog geen partners toegevoegd. Voeg je eerste partner toe!</p>
        </CardContent>
      </Card>
    </div>
  )
}

