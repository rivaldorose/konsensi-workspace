import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DocDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Document</h1>
        <p className="text-grey-600 mt-2">Document ID: {params.id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Content</CardTitle>
          <CardDescription>Document inhoud</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Document content wordt hier getoond</p>
        </CardContent>
      </Card>
    </div>
  )
}

