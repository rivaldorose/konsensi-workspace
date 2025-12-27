import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { User, Users, Settings as SettingsIcon, Palette, Shield, BarChart, Plug } from 'lucide-react'

const settingsSections = [
  { name: 'Profile', href: '/settings/profile', icon: User, description: 'Beheer je persoonlijke gegevens' },
  { name: 'Team', href: '/settings/team', icon: Users, description: 'Beheer teamleden' },
  { name: 'Integrations', href: '/settings/integrations', icon: Plug, description: 'Beheer integraties' },
  { name: 'Appearance', href: '/settings/appearance', icon: Palette, description: 'Pas het uiterlijk aan' },
  { name: 'Security', href: '/settings/security', icon: Shield, description: 'Beveiligingsinstellingen' },
  { name: 'Usage', href: '/settings/usage', icon: BarChart, description: 'Gebruiksstatistieken' },
]

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Settings</h1>
        <p className="text-grey-600 mt-2">Beheer je workspace instellingen</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsSections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <section.icon className="h-5 w-5 text-primary-500" />
                  <CardTitle>{section.name}</CardTitle>
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

