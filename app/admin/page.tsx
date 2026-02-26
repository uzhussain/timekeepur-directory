import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BookOpen, ArrowLeft, LogOut } from 'lucide-react'
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
      <nav className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="font-medium text-sm">Timekeepur</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{session.email}</span>
            <form action={signOutAction}>
              <Button variant="ghost" size="sm" type="submit" className="h-8 gap-1.5">
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </nav>

      <main className="py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold">Admin</h1>
              <p className="text-xs text-muted-foreground">Moderate submissions</p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 rounded-md border border-border">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Pending</p>
              <p className="text-xl font-semibold">{pendingCount}</p>
            </div>
            <div className="p-3 rounded-md border border-border">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Approved</p>
              <p className="text-xl font-semibold">{approvedCount}</p>
            </div>
            <div className="p-3 rounded-md border border-border">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Rejected</p>
              <p className="text-xl font-semibold">{rejectedCount}</p>
            </div>
          </div>

          <AdminMessageList initialMessages={messages} />
        </div>
      </main>
    </div>
  )
}
