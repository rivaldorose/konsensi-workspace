import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Grid3x3, Users, Calendar, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Dashboard</h1>
        <p className="text-grey-600 mt-2">Welkom terug! Hier is een overzicht van je workspace.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Apps</CardTitle>
            <Grid3x3 className="h-4 w-4 text-grey-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-grey-500">Totaal aantal apps</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partners</CardTitle>
            <Users className="h-4 w-4 text-grey-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-grey-500">Actieve partnerships</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-grey-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-grey-500">Lopende events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals</CardTitle>
            <TrendingUp className="h-4 w-4 text-grey-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-grey-500">Quarterly goals</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recente Apps</CardTitle>
            <CardDescription>Laatst gewijzigde apps</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-grey-500">Nog geen apps toegevoegd</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actieve Events</CardTitle>
            <CardDescription>Events die momenteel lopen</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-grey-500">Geen actieve events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Aankomende deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-grey-500">Geen aankomende deadlines</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
