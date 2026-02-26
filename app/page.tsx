import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getLatestApprovedMessage } from '@/lib/db'
import { RecentMessagePreview } from '@/components/recent-message-preview'
import { unstable_cacheTag as cacheTag } from 'next/cache'

export default async function HomePage() {
  'use cache'
  cacheTag('guestbook-messages')
  
  const latestMessage = await getLatestApprovedMessage()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold tracking-tight">TIMEKEEPUR</span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-widest">LABS</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link 
              href="/guestbook" 
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Guestbook
            </Link>
            <Link 
              href="/admin" 
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-4 text-[10px] tracking-wide">
                AI-POWERED
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance mb-4">
                A modern guestbook for the AI era
              </h1>
              <p className="text-muted-foreground leading-relaxed text-balance max-w-xl mx-auto">
                Leave your mark at TIMEKEEPUR LABS. Our guestbook uses the Vercel AI Gateway 
                to enhance your messages in three ways: content moderation, multi-language translation, 
                and creative emoji transformation.
              </p>
            </div>

            {/* Latest Message Preview */}
            <div className="mb-10">
              <RecentMessagePreview message={latestMessage} />
            </div>

            <div className="flex items-center justify-center">
              <Link href="/guestbook">
                <Button size="lg" className="h-11 px-8">
                  Sign the Guestbook
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section className="py-12 px-4 border-t border-border">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-lg font-medium tracking-tight mb-6 text-center">How it works</h2>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-5 border border-border rounded-lg">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <span className="text-primary text-xs font-medium">1</span>
                </div>
                <h3 className="text-sm font-medium mb-1.5">Write your message</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Share your thoughts. Optionally translate to Spanish, French, German, Japanese, Korean, or Chinese - or convert to emoji art.
                </p>
              </div>

              <div className="p-5 border border-border rounded-lg">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <span className="text-primary text-xs font-medium">2</span>
                </div>
                <h3 className="text-sm font-medium mb-1.5">AI moderation</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Messages are automatically screened for inappropriate content to keep the community safe and welcoming.
                </p>
              </div>

              <div className="p-5 border border-border rounded-lg">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <span className="text-primary text-xs font-medium">3</span>
                </div>
                <h3 className="text-sm font-medium mb-1.5">Admin review</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  An admin reviews and approves messages before they appear publicly in the guestbook.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-semibold tracking-tight">TIMEKEEPUR</span>
              <span className="text-[9px] text-muted-foreground font-medium tracking-widest">LABS</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Built with Next.js, Neon, and Vercel AI Gateway
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
