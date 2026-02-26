import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BookOpen, ArrowLeft, Shield, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSession, destroySession } from '@/lib/auth'
import { getAllMessages } from '@/lib/db'
import { AdminMessageList } from '@/components/admin-message-list'

async function signOutAction() {
  'use server'
  await destroySession()
  redirect('/admin/login')
}

export default async function AdminPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  const messages = await getAllMessages()
  const pendingCount = messages.filter(m => m.status === 'pending').length
  const approvedCount = messages.filter(m => m.status === 'approved').length
  const rejectedCount = messages.filter(m => m.status === 'rejected').length

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
              {session.email}
            </span>
            <form action={signOutAction}>
              <Button variant="outline" size="sm" type="submit" className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </form>
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
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">Pending</p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{pendingCount}</p>
            </div>
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-emerald-800 dark:text-emerald-200">Approved</p>
              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{approvedCount}</p>
            </div>
            <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800">
              <p className="text-sm text-rose-800 dark:text-rose-200">Rejected</p>
              <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">{rejectedCount}</p>
            </div>
          </div>

          {/* Message List */}
          <AdminMessageList initialMessages={messages} />
        </div>
      </main>
    </div>
  )
}
