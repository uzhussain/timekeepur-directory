import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BookOpen, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { stackServerApp } from '@/lib/stack-auth'
import { SignIn } from '@stack-auth/react'

export default async function AdminLoginPage() {
  const user = await stackServerApp.getUser()
  
  if (user) {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-foreground" />
            <span className="font-semibold text-lg text-foreground">Timekeepur Directory</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">Back to Site</Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-border">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-foreground">Admin Login</CardTitle>
            <CardDescription>
              Sign in to access the moderation dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignIn />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
