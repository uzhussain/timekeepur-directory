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
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-foreground" />
            <span className="font-semibold text-lg text-foreground">Timekeepur Directory</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back Home
            </Button>
          </Link>
        </div>
      </nav>

      <main className="py-12 px-4">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Guestbook</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Sign our guestbook and leave your mark. Your message can be enhanced 
              with AI magic - convert to emojis or translate to another language!
            </p>
          </div>

          {/* Submit Form */}
          <div className="mb-16">
            <GuestbookForm />
          </div>

          {/* Messages */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Recent Messages
              <span className="text-muted-foreground font-normal text-base ml-2">
                ({messages.length})
              </span>
            </h2>

            {messages.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-lg">
                <p className="text-muted-foreground">
                  No messages yet. Be the first to sign the guestbook!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
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
