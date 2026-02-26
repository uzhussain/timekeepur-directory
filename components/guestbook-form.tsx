'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { submitGuestbookMessage } from '@/app/actions/message-actions'
import { Loader2, Send, Sparkles, Globe, MessageSquare, CheckCircle, XCircle } from 'lucide-react'

const LANGUAGES = [
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ar', label: 'Arabic' },
  { value: 'hi', label: 'Hindi' },
]

export function GuestbookForm() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)
  const [enhanceType, setEnhanceType] = useState('original')
  const [targetLanguage, setTargetLanguage] = useState('')

  async function handleSubmit(formData: FormData) {
    setResult(null)
    formData.set('enhanceType', enhanceType)
    if (targetLanguage) {
      formData.set('targetLanguage', targetLanguage)
    }

    startTransition(async () => {
      const response = await submitGuestbookMessage(formData)
      setResult(response)
      
      if (response.success) {
        // Reset form on success
        const form = document.getElementById('guestbook-form') as HTMLFormElement
        form?.reset()
        setEnhanceType('original')
        setTargetLanguage('')
      }
    })
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Sign the Guestbook</CardTitle>
        <CardDescription>
          Leave a message for our community. Add AI enhancements to make it special!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="guestbook-form" action={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                required
                maxLength={100}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email (optional)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground">Message *</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Write your message here..."
              required
              maxLength={1000}
              rows={4}
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">Max 1000 characters</p>
          </div>

          {/* AI Enhancement Options */}
          <div className="space-y-3">
            <Label className="text-foreground">AI Enhancement (optional)</Label>
            <RadioGroup
              value={enhanceType}
              onValueChange={setEnhanceType}
              className="grid sm:grid-cols-3 gap-3"
              disabled={isPending}
            >
              <Label
                htmlFor="original"
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  enhanceType === 'original' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="original" id="original" />
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">Original</span>
                </div>
              </Label>

              <Label
                htmlFor="emoji"
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  enhanceType === 'emoji' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="emoji" id="emoji" />
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">Emoji Only</span>
                </div>
              </Label>

              <Label
                htmlFor="translate"
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  enhanceType === 'translate' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="translate" id="translate" />
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">Translate</span>
                </div>
              </Label>
            </RadioGroup>

            {enhanceType === 'translate' && (
              <Select value={targetLanguage} onValueChange={setTargetLanguage} disabled={isPending}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Select target language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Result Message */}
          {result && (
            <div
              className={`flex items-center gap-2 p-4 rounded-lg ${
                result.success 
                  ? 'bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200' 
                  : 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200'
              }`}
            >
              {result.success ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <p className="text-sm">{result.success ? result.message : result.error}</p>
            </div>
          )}

          <Button type="submit" disabled={isPending} className="w-full sm:w-auto gap-2">
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
