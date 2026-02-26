import Link from 'next/link'
import { BookOpen, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getApprovedMessages } from '@/lib/db'
import { GuestbookForm } from '@/components/guestbook-form'
import { MessageCard } from '@/components/message-card'

export const revalidate = 60

export default async function GuestbookPage() {
  const messages = await getApprovedMessages()

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="font-medium text-sm">Timekeepur</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Button>
          </Link>
        </div>
      </nav>

      <main className="py-10 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="text-xl font-semibold mb-1">Guestbook</h1>
            <p className="text-sm text-muted-foreground">
              Leave your mark. Enhance with AI if you like.
            </p>
          </div>

          <div className="mb-12">
            <GuestbookForm />
          </div>

          <div>
            <h2 className="text-sm font-medium mb-4">
              Messages <span className="text-muted-foreground">({messages.length})</span>
            </h2>

            {messages.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-border rounded-md">
                <p className="text-sm text-muted-foreground">
                  No messages yet. Be the first.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <MessageCard key={message.id} message={message} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
