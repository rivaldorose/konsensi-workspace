import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Marketing</h1>
        <p className="text-grey-600 mt-2">Marketing tools en campagnes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marketing Dashboard</CardTitle>
          <CardDescription>Marketing overzicht en tools</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Marketing tools komen hier</p>
        </CardContent>
      </Card>
    </div>
  )
}

