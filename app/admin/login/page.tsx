'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="font-medium text-sm">Timekeepur</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">Back</Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xs">
          <div className="text-center mb-6">
            <h1 className="text-lg font-semibold">Admin Login</h1>
            <p className="text-xs text-muted-foreground">Sign in to moderate</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@timekeepur.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-9 text-sm"
              />
            </div>
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" size="sm" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          <p className="text-[10px] text-muted-foreground mt-4 text-center">
            Default: admin@timekeepur.com / admin123
          </p>
        </div>
      </main>
    </div>
  )
}
