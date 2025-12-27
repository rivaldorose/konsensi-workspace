import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Notifications</h1>
        <p className="text-grey-600 mt-2">Alle notificaties</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notificaties</CardTitle>
          <CardDescription>Overzicht van alle notificaties</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Geen notificaties</p>
        </CardContent>
      </Card>
    </div>
  )
}

