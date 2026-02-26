import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
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
        <section className="py-20 px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4 text-[10px] tracking-wide">
              AI-POWERED
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance mb-4">
              A modern guestbook for the AI era
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-8 text-balance">
              Leave your mark with intelligent message enhancement. Our AI moderates content, 
              translates across languages, and transforms text into expressive emoji art.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/guestbook">
                <Button size="lg" className="h-11 px-6">
                  Sign the Guestbook
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-11 px-6">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-4 border-t border-border">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-xl font-medium tracking-tight mb-2">How it works</h2>
              <p className="text-sm text-muted-foreground">
                Simple, secure, and enhanced by AI
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="p-6 border border-border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary text-sm font-medium">1</span>
                </div>
                <h3 className="text-sm font-medium mb-2">Write your message</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Share your thoughts, greetings, or feedback. Express yourself freely.
                </p>
              </div>

              <div className="p-6 border border-border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary text-sm font-medium">2</span>
                </div>
                <h3 className="text-sm font-medium mb-2">AI enhancement</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Choose to keep it original, translate to another language, or convert to emoji.
                </p>
              </div>

              <div className="p-6 border border-border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary text-sm font-medium">3</span>
                </div>
                <h3 className="text-sm font-medium mb-2">Moderated & published</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  AI moderates for safety, then admins review before your message goes live.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Features Section */}
        <section className="py-16 px-4 border-t border-border bg-muted/30">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-xl font-medium tracking-tight mb-2">Powered by AI</h2>
              <p className="text-sm text-muted-foreground">
                Three intelligent features that make your messages shine
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-background p-6 border border-border rounded-lg">
                <div className="text-2xl mb-3">🛡️</div>
                <h3 className="text-sm font-medium mb-2">Smart Moderation</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  AI automatically screens messages for inappropriate content, keeping the 
                  community safe and welcoming.
                </p>
              </div>

              <div className="bg-background p-6 border border-border rounded-lg">
                <div className="text-2xl mb-3">🌍</div>
                <h3 className="text-sm font-medium mb-2">Translation</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Translate your message into Spanish, French, German, Japanese, Korean, 
                  or Chinese with one click.
                </p>
              </div>

              <div className="bg-background p-6 border border-border rounded-lg">
                <div className="text-2xl mb-3">✨</div>
                <h3 className="text-sm font-medium mb-2">Emoji Mode</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Transform your text into a creative emoji sequence that captures 
                  the meaning and emotion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 border-t border-border">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-medium tracking-tight mb-3">
              Ready to leave your mark?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Join others who have signed the TIMEKEEPUR LABS guestbook.
            </p>
            <Link href="/guestbook">
              <Button size="lg" className="h-11 px-8">
                Sign the Guestbook
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-semibold tracking-tight">TIMEKEEPUR</span>
              <span className="text-[9px] text-muted-foreground font-medium tracking-widest">LABS</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Built with Next.js, Neon, and Vercel AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
