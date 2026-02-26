import Link from 'next/link'
import { redirect } from 'next/navigation'
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
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold tracking-tight">TIMEKEEPUR</span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-widest">LABS</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">{session.email}</span>
            <form action={signOutAction}>
              <Button variant="ghost" size="sm" type="submit" className="h-7 text-xs px-2">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-medium tracking-tight">Admin</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Moderate submissions</p>
            </div>
            <Link href="/guestbook">
              <Button variant="outline" size="sm" className="h-8 text-xs">
                View Guestbook
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="p-3 border border-border rounded">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Pending</p>
              <p className="text-xl font-medium">{pendingCount}</p>
            </div>
            <div className="p-3 border border-border rounded">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Approved</p>
              <p className="text-xl font-medium">{approvedCount}</p>
            </div>
            <div className="p-3 border border-border rounded">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Rejected</p>
              <p className="text-xl font-medium">{rejectedCount}</p>
            </div>
          </div>

          <AdminMessageList initialMessages={messages} />
        </div>
      </main>
    </div>
  )
}
