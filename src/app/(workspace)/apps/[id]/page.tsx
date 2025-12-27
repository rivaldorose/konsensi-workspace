import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AppDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">App Details</h1>
        <p className="text-grey-600 mt-2">App ID: {params.id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>App Informatie</CardTitle>
          <CardDescription>Details van deze app</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">App details worden hier getoond</p>
        </CardContent>
      </Card>
    </div>
  )
}

