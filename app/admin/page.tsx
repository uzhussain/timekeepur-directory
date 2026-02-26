import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BookOpen, ArrowLeft, Shield, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getStackServerApp, isStackAuthConfigured } from '@/lib/stack-auth'
import { getAllMessages } from '@/lib/db'
import { AdminMessageList } from '@/components/admin-message-list'

export default async function AdminPage() {
  // Check if Stack Auth is configured
  if (!isStackAuthConfigured) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-foreground" />
              <span className="font-semibold text-lg text-foreground">Timekeepur Directory</span>
            </Link>
          </div>
        </nav>
        <main className="py-12 px-4">
          <div className="mx-auto max-w-2xl">
            <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <AlertTriangle className="h-5 w-5" />
                  Stack Auth Not Configured
                </CardTitle>
              </CardHeader>
              <CardContent className="text-yellow-700 dark:text-yellow-300">
                <p className="mb-4">
                  To access the admin dashboard, you need to configure Stack Auth (Neon Auth).
                </p>
                <p className="text-sm">
                  Required environment variables:
                </p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li><code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">NEXT_PUBLIC_STACK_PROJECT_ID</code></li>
                  <li><code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">STACK_SECRET_SERVER_KEY</code></li>
                </ul>
                <p className="text-sm mt-4">
                  These are automatically provided when you enable Neon Auth in your project.
                </p>
                <Link href="/" className="inline-block mt-4">
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Site
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  const stackApp = await getStackServerApp()
  const user = stackApp ? await stackApp.getUser() : null
  
  if (!user) {
    redirect('/admin/login')
  }

  const messages = await getAllMessages()
  const pendingCount = messages.filter(m => m.status === 'pending').length
  const approvedCount = messages.filter(m => m.status === 'approved').length
  const rejectedCount = messages.filter(m => m.status === 'rejected').length

  // Dynamically import SignOut only when Stack Auth is configured
  const { SignOut } = await import('@stack-auth/react')

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-foreground" />
            <span className="font-semibold text-lg text-foreground">Timekeepur Directory</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user.primaryEmail}
            </span>
            <SignOut>
              <Button variant="outline" size="sm">Sign Out</Button>
            </SignOut>
          </div>
        </div>
      </nav>

      <main className="py-12 px-4">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              </div>
              <p className="text-muted-foreground">
                Review and moderate guestbook submissions
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Site
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{pendingCount}</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200">Approved</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{approvedCount}</p>
            </div>
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">Rejected</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">{rejectedCount}</p>
            </div>
          </div>

          {/* Message List */}
          <AdminMessageList initialMessages={messages} />
        </div>
      </main>
    </div>
  )
}
