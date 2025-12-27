import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function AppsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-500">Apps</h1>
          <p className="text-grey-600 mt-2">Beheer al je apps en producten</p>
        </div>
        <Button asChild>
          <Link href="/apps/new">
            <Plus className="h-4 w-4 mr-2" />
            Nieuwe App
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Apps Overzicht</CardTitle>
          <CardDescription>Alle apps in je workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Nog geen apps toegevoegd. Maak je eerste app aan!</p>
        </CardContent>
      </Card>
    </div>
  )
}

