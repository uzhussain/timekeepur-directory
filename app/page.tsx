import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Shield, Sparkles, Globe, MessageSquare, Users } from 'lucide-react'

export default function HomePage() {
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
            <Link href="/guestbook">
              <Button variant="ghost">View Guestbook</Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline">Admin</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground mb-6 text-balance">
            Leave Your Mark in Our Community Directory
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Timekeepur Directory is an AI-powered guestbook where visitors can share messages, 
            thoughts, and greetings. Each message is thoughtfully moderated and can be 
            enhanced with AI magic.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/guestbook">
              <Button size="lg" className="gap-2">
                <MessageSquare className="h-5 w-5" />
                Sign the Guestbook
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-4">
            Powered by AI, Protected by Design
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Modern guestbook experience with intelligent features that make every message special.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">AI Moderation</h3>
                <p className="text-muted-foreground">
                  Every message is automatically screened by AI to ensure a safe and 
                  respectful environment for all visitors.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Emoji Magic</h3>
                <p className="text-muted-foreground">
                  Transform your message into expressive emojis. Let AI capture your 
                  sentiment in a fun, visual way.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Translation</h3>
                <p className="text-muted-foreground">
                  Share your message in any language. AI can translate your thoughts 
                  to connect with a global audience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            How It Works
          </h2>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Write Your Message</h3>
                <p className="text-muted-foreground">
                  Compose your message with your name. Optionally enhance it with AI 
                  by converting to emojis or translating to another language.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">AI Moderation</h3>
                <p className="text-muted-foreground">
                  Your message is instantly reviewed by our AI to ensure it meets 
                  community guidelines. Most appropriate messages pass immediately.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Admin Approval</h3>
                <p className="text-muted-foreground">
                  After AI moderation, an admin reviews and approves your message. 
                  Once approved, it appears in the public guestbook for all to see.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl text-center">
          <Users className="h-12 w-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Be part of something special. Leave a message that will be remembered.
          </p>
          <Link href="/guestbook">
            <Button size="lg" variant="secondary" className="gap-2">
              <MessageSquare className="h-5 w-5" />
              Sign the Guestbook Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-5 w-5" />
            <span>Timekeepur Directory</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with Next.js, Neon, and Vercel AI Gateway
          </p>
        </div>
      </footer>
    </div>
  )
}
