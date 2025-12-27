import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AppearanceSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Appearance Settings</h1>
        <p className="text-grey-600 mt-2">Pas het uiterlijk aan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uiterlijk</CardTitle>
          <CardDescription>Pas het thema en uiterlijk aan</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Appearance instellingen komen hier</p>
        </CardContent>
      </Card>
    </div>
  )
}

