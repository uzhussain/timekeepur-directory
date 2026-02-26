import Link from 'next/link'
import { getApprovedMessages } from '@/lib/db'
import { MessageList } from '@/components/message-list'
import { PostMessageSheet } from '@/components/post-message-sheet'

export const revalidate = 60

export default async function HomePage() {
  const messages = await getApprovedMessages()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-2xl px-4 h-12 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium tracking-tight">
            Timekeepur
          </Link>
          <Link 
            href="/admin" 
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Admin
          </Link>
        </div>
      </header>

      <main className="flex-1 py-8 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-medium tracking-tight">Directory</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {messages.length} {messages.length === 1 ? 'entry' : 'entries'}
              </p>
            </div>
            <PostMessageSheet />
          </div>

          <MessageList messages={messages} />
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-2xl px-4 h-10 flex items-center justify-center">
          <p className="text-[11px] text-muted-foreground">
            Powered by Neon and Vercel
          </p>
        </div>
      </footer>
    </div>
  )
}
