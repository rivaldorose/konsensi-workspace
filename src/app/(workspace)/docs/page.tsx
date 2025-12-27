import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-500">Documentatie</h1>
          <p className="text-grey-600 mt-2">Beheer je documentatie</p>
        </div>
        <Button asChild>
          <Link href="/docs/new">
            <Plus className="h-4 w-4 mr-2" />
            Nieuw Document
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documentatie Overzicht</CardTitle>
          <CardDescription>Alle documenten in je workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Nog geen documenten toegevoegd. Maak je eerste document aan!</p>
        </CardContent>
      </Card>
    </div>
  )
}

