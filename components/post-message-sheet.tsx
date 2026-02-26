'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet'
import { submitGuestbookMessage } from '@/app/actions/message-actions'

const LANGUAGES = [
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
]

export function PostMessageSheet() {
  const [open, setOpen] = useState(false)
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
        const form = document.getElementById('post-form') as HTMLFormElement
        form?.reset()
        setEnhanceType('original')
        setTargetLanguage('')
        setTimeout(() => setOpen(false), 1500)
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="h-8 text-xs">
          Post Message
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-base">Sign the Directory</SheetTitle>
          <SheetDescription className="text-xs">
            Your message will be reviewed before appearing publicly.
          </SheetDescription>
        </SheetHeader>
        
        <form id="post-form" action={handleSubmit} className="mt-6 space-y-4 px-4">
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
            <Label htmlFor="email" className="text-xs">
              Email <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              disabled={isPending}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-xs">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Write your message..."
              required
              maxLength={1000}
              rows={4}
              disabled={isPending}
              className="text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Enhancement</Label>
            <RadioGroup
              value={enhanceType}
              onValueChange={setEnhanceType}
              className="flex gap-2"
              disabled={isPending}
            >
              {[
                { value: 'original', label: 'Original' },
                { value: 'emoji', label: 'Emoji' },
                { value: 'translate', label: 'Translate' },
              ].map((option) => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className={`flex items-center gap-2 px-3 py-1.5 border rounded cursor-pointer text-xs transition-colors ${
                    enhanceType === option.value 
                      ? 'border-foreground bg-foreground text-background' 
                      : 'border-border hover:border-foreground/50'
                  }`}
                >
                  <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                  {option.label}
                </Label>
              ))}
            </RadioGroup>

            {enhanceType === 'translate' && (
              <Select value={targetLanguage} onValueChange={setTargetLanguage} disabled={isPending}>
                <SelectTrigger className="w-full h-9 text-xs">
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

          <Button type="submit" disabled={isPending} size="sm" className="w-full h-9">
            {isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
