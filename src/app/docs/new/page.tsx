import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewDocPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Nieuw Document</h1>
        <p className="text-grey-600 mt-2">Maak een nieuw document aan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Details</CardTitle>
          <CardDescription>Vul de details van het document in</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Document editor komt hier</p>
        </CardContent>
      </Card>
    </div>
  )
}

