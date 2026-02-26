import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BookOpen, Shield, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getStackServerApp, isStackAuthConfigured } from '@/lib/stack-auth'

export default async function AdminLoginPage() {
  // Check if Stack Auth is configured
  if (!isStackAuthConfigured) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
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
          <Card className="w-full max-w-md border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950">
            <CardHeader className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-yellow-800 dark:text-yellow-200">Configuration Required</CardTitle>
              <CardDescription className="text-yellow-700 dark:text-yellow-300">
                Stack Auth (Neon Auth) is not configured
              </CardDescription>
            </CardHeader>
            <CardContent className="text-yellow-700 dark:text-yellow-300 text-sm">
              <p>Set the following environment variables:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">NEXT_PUBLIC_STACK_PROJECT_ID</code></li>
                <li><code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">STACK_SECRET_SERVER_KEY</code></li>
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const stackApp = await getStackServerApp()
  const user = stackApp ? await stackApp.getUser() : null
  
  if (user) {
    redirect('/admin')
  }

  // Dynamically import SignIn only when Stack Auth is configured
  const { SignIn } = await import('@stack-auth/react')

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
