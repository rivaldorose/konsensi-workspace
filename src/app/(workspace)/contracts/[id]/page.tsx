import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ContractDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Contract Details</h1>
        <p className="text-grey-600 mt-2">Contract ID: {params.id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contract Informatie</CardTitle>
          <CardDescription>Details van dit contract</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Contract details worden hier getoond</p>
        </CardContent>
      </Card>
    </div>
  )
}

