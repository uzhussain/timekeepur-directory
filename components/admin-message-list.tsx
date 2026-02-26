'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { GuestbookMessage } from '@/lib/db'
import { approveMessage, rejectMessage } from '@/app/actions/message-actions'
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
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4 h-8">
        <TabsTrigger value="pending" className="text-xs h-7">
          Pending {pendingCount > 0 && `(${pendingCount})`}
        </TabsTrigger>
        <TabsTrigger value="approved" className="text-xs h-7">Approved</TabsTrigger>
        <TabsTrigger value="rejected" className="text-xs h-7">Rejected</TabsTrigger>
        <TabsTrigger value="all" className="text-xs h-7">All</TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No messages</p>
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
  return (
    <article className="border border-border rounded p-4">
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-sm font-medium truncate">{message.name}</span>
          {message.email && (
            <span className="text-[11px] text-muted-foreground truncate hidden sm:inline">
              {message.email}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {message.enhanced_type !== 'original' && (
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              {message.enhanced_type === 'emoji' ? 'emoji' : message.language}
            </span>
          )}
          <span className={`text-[10px] uppercase tracking-wide ${
            message.status === 'approved' 
              ? 'text-foreground' 
              : message.status === 'rejected' 
              ? 'text-destructive' 
              : 'text-muted-foreground'
          }`}>
            {message.status}
          </span>
          <time className="text-[11px] text-muted-foreground">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </time>
        </div>
      </div>
      
      <p className={`text-sm leading-relaxed ${message.enhanced_type === 'emoji' ? 'text-lg' : ''}`}>
        {message.message}
      </p>
      
      {message.original_message && (
        <p className="text-[11px] text-muted-foreground mt-2">
          Original: {message.original_message}
        </p>
      )}

      {message.status === 'pending' && (
        <div className="flex items-center gap-2 pt-3 mt-3 border-t border-border">
          <Textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={1}
            disabled={isProcessing}
            className="text-xs h-8 min-h-8 resize-none flex-1"
          />
          <Button
            onClick={onApprove}
            disabled={isProcessing}
            size="sm"
            className="h-8 text-xs"
          >
            {isProcessing ? 'Processing...' : 'Approve'}
          </Button>
          <Button
            onClick={onReject}
            disabled={isProcessing}
            variant="outline"
            size="sm"
            className="h-8 text-xs"
          >
            Reject
          </Button>
        </div>
      )}

      {message.status !== 'pending' && message.moderated_by && (
        <p className="text-[10px] text-muted-foreground pt-2 mt-2 border-t border-border">
          Moderated by {message.moderated_by}
          {message.moderation_notes && ` - ${message.moderation_notes}`}
        </p>
      )}
    </article>
  )
}
