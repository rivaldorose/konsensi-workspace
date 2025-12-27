import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PartnerDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Partner Details</h1>
        <p className="text-grey-600 mt-2">Partner ID: {params.id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partner Informatie</CardTitle>
          <CardDescription>Details van deze partner</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Partner details worden hier getoond</p>
        </CardContent>
      </Card>
    </div>
  )
}

