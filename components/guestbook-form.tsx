'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { submitGuestbookMessage } from '@/app/actions/message-actions'
import { Loader2 } from 'lucide-react'

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
        const form = document.getElementById('guestbook-form') as HTMLFormElement
        form?.reset()
        setEnhanceType('original')
        setTargetLanguage('')
      }
    })
  }

  return (
    <form id="guestbook-form" action={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            required
            maxLength={100}
            disabled={isPending}
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs">Email <span className="text-muted-foreground">(optional)</span></Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            disabled={isPending}
            className="h-9 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-xs">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Write your message..."
          required
          maxLength={1000}
          rows={3}
          disabled={isPending}
          className="text-sm resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Enhancement</Label>
        <RadioGroup
          value={enhanceType}
          onValueChange={setEnhanceType}
          className="flex flex-wrap gap-2"
          disabled={isPending}
        >
          <Label
            htmlFor="original"
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-md cursor-pointer text-xs transition-colors ${
              enhanceType === 'original' ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground/50'
            }`}
          >
            <RadioGroupItem value="original" id="original" className="sr-only" />
            Original
          </Label>

          <Label
            htmlFor="emoji"
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-md cursor-pointer text-xs transition-colors ${
              enhanceType === 'emoji' ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground/50'
            }`}
          >
            <RadioGroupItem value="emoji" id="emoji" className="sr-only" />
            Emoji Only
          </Label>

          <Label
            htmlFor="translate"
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-md cursor-pointer text-xs transition-colors ${
              enhanceType === 'translate' ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground/50'
            }`}
          >
            <RadioGroupItem value="translate" id="translate" className="sr-only" />
            Translate
          </Label>
        </RadioGroup>

        {enhanceType === 'translate' && (
          <Select value={targetLanguage} onValueChange={setTargetLanguage} disabled={isPending}>
            <SelectTrigger className="w-full sm:w-48 h-9 text-xs">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value} className="text-xs">
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {result && (
        <p className={`text-xs ${result.success ? 'text-muted-foreground' : 'text-destructive'}`}>
          {result.success ? result.message : result.error}
        </p>
      )}

      <Button type="submit" disabled={isPending} size="sm">
        {isPending ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
            Submitting...
          </>
        ) : (
          'Submit'
        )}
      </Button>
    </form>
  )
}
