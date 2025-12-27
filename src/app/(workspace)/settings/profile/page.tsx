import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Profile Settings</h1>
        <p className="text-grey-600 mt-2">Beheer je persoonlijke gegevens</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Informatie</CardTitle>
          <CardDescription>Update je persoonlijke gegevens</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Profile formulier komt hier</p>
        </CardContent>
      </Card>
    </div>
  )
}

