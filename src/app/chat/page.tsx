import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-500">Chat</h1>
        <p className="text-grey-600 mt-2">Team communicatie</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chat</CardTitle>
          <CardDescription>Team chat functionaliteit</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-grey-500">Chat interface komt hier</p>
        </CardContent>
      </Card>
    </div>
  )
}

