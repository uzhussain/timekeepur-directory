import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Shield, Sparkles, Globe } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="font-medium text-sm">Timekeepur</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/guestbook">
              <Button variant="ghost" size="sm">Guestbook</Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="py-16 px-4">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight mb-3">
            Community Directory
          </h1>
          <p className="text-muted-foreground mb-6">
            Leave a message. Enhance it with AI. Join our guestbook.
          </p>
          <Link href="/guestbook">
            <Button>Sign the Guestbook</Button>
          </Link>
        </div>

        <div className="mx-auto max-w-2xl mt-20">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border mb-3">
                <Shield className="h-4 w-4" />
              </div>
              <h3 className="font-medium text-sm mb-1">AI Moderation</h3>
              <p className="text-xs text-muted-foreground">
                Messages are screened automatically
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border mb-3">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="font-medium text-sm mb-1">Emoji Mode</h3>
              <p className="text-xs text-muted-foreground">
                Convert your message to emojis
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border mb-3">
                <Globe className="h-4 w-4" />
              </div>
              <h3 className="font-medium text-sm mb-1">Translation</h3>
              <p className="text-xs text-muted-foreground">
                Share in multiple languages
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-4 px-4">
        <p className="text-center text-xs text-muted-foreground">
          Built with Next.js, Neon, and Vercel AI Gateway
        </p>
      </footer>
    </div>
  )
}
