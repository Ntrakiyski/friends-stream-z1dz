import { User } from '@/types'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface UserSelectorProps {
  onSelectUser: (user: User) => void
}

const users: User[] = ['Chris', 'Nick', 'Angel']

export function UserSelector({ onSelectUser }: UserSelectorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Simple Video Messenger</CardTitle>
          <CardDescription>Select your name to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {users.map(user => (
            <Button
              key={user}
              onClick={() => onSelectUser(user)}
              variant="outline"
              className="w-full text-lg h-12"
            >
              {user}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
