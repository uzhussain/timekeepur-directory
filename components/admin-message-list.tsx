'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { GuestbookMessage } from '@/lib/db'
import { approveMessage, rejectMessage } from '@/app/actions/message-actions'
import { Check, X, User, Sparkles, Globe, Loader2, Clock, Mail } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface AdminMessageListProps {
  initialMessages: GuestbookMessage[]
}

export function AdminMessageList({ initialMessages }: AdminMessageListProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [activeTab, setActiveTab] = useState('pending')
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [notes, setNotes] = useState<Record<number, string>>({})
  const [isPending, startTransition] = useTransition()

  const filteredMessages = messages.filter(m => {
    if (activeTab === 'all') return true
    return m.status === activeTab
  })

  async function handleApprove(id: number) {
    setProcessingId(id)
    startTransition(async () => {
      const result = await approveMessage(id, notes[id])
      if (result.success) {
        setMessages(prev => 
          prev.map(m => m.id === id ? { ...m, status: 'approved' as const } : m)
        )
      }
      setProcessingId(null)
    })
  }

  async function handleReject(id: number) {
    setProcessingId(id)
    startTransition(async () => {
      const result = await rejectMessage(id, notes[id])
      if (result.success) {
        setMessages(prev => 
          prev.map(m => m.id === id ? { ...m, status: 'rejected' as const } : m)
        )
      }
      setProcessingId(null)
    })
  }

  const pendingCount = messages.filter(m => m.status === 'pending').length

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending" className="gap-2">
            Pending
            {pendingCount > 0 && (
              <Badge variant="secondary" className="ml-1">{pendingCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">No messages in this category</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                isProcessing={processingId === message.id && isPending}
                onApprove={() => handleApprove(message.id)}
                onReject={() => handleReject(message.id)}
                notes={notes[message.id] || ''}
                onNotesChange={(value) => setNotes(prev => ({ ...prev, [message.id]: value }))}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface MessageItemProps {
  message: GuestbookMessage
  isProcessing: boolean
  onApprove: () => void
  onReject: () => void
  notes: string
  onNotesChange: (value: string) => void
}

function MessageItem({ 
  message, 
  isProcessing, 
  onApprove, 
  onReject,
  notes,
  onNotesChange
}: MessageItemProps) {
  const enhanceIcon = message.enhanced_type === 'emoji' 
    ? <Sparkles className="h-3 w-3" />
    : message.enhanced_type === 'translated' 
    ? <Globe className="h-3 w-3" />
    : null

  const enhanceLabel = message.enhanced_type === 'emoji'
    ? 'Emoji'
    : message.enhanced_type === 'translated'
    ? message.language.toUpperCase()
    : null

  return (
    <Card className="border-border">
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
          {/* Message Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{message.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    {message.email && (
                      <>
                        <span className="text-border">|</span>
                        <Mail className="h-3 w-3" />
                        {message.email}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {enhanceLabel && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    {enhanceIcon}
                    {enhanceLabel}
                  </Badge>
                )}
                <Badge 
                  variant={
                    message.status === 'approved' 
                      ? 'default' 
                      : message.status === 'rejected' 
                      ? 'destructive' 
                      : 'secondary'
                  }
                >
                  {message.status}
                </Badge>
              </div>
            </div>
            
            <p className={`text-foreground ${message.enhanced_type === 'emoji' ? 'text-2xl' : ''}`}>
              {message.message}
            </p>
            
            {message.original_message && (
              <p className="mt-2 text-sm text-muted-foreground italic">
                Original: {message.original_message}
              </p>
            )}
          </div>

          {/* Actions (only for pending) */}
          {message.status === 'pending' && (
            <div className="lg:w-72 space-y-3 lg:border-l lg:border-border lg:pl-4">
              <Textarea
                placeholder="Add notes (optional)"
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                rows={2}
                disabled={isProcessing}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button
                  onClick={onApprove}
                  disabled={isProcessing}
                  className="flex-1 gap-2"
                  size="sm"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Approve
                </Button>
                <Button
                  onClick={onReject}
                  disabled={isProcessing}
                  variant="destructive"
                  className="flex-1 gap-2"
                  size="sm"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  Reject
                </Button>
              </div>
            </div>
          )}

          {/* Moderation info for processed messages */}
          {message.status !== 'pending' && message.moderated_by && (
            <div className="lg:w-48 text-sm text-muted-foreground lg:border-l lg:border-border lg:pl-4">
              <p>Moderated by:</p>
              <p className="font-medium text-foreground truncate">{message.moderated_by}</p>
              {message.moderation_notes && (
                <p className="mt-1 italic">{message.moderation_notes}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
