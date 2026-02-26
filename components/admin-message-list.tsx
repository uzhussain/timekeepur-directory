'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { GuestbookMessage } from '@/lib/db'
import { approveMessage, rejectMessage } from '@/app/actions/message-actions'
import { Check, X, Loader2 } from 'lucide-react'
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
        <TabsTrigger value="pending" className="text-xs h-7 gap-1.5">
          Pending
          {pendingCount > 0 && (
            <Badge variant="secondary" className="text-[10px] px-1 py-0">{pendingCount}</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="approved" className="text-xs h-7">Approved</TabsTrigger>
        <TabsTrigger value="rejected" className="text-xs h-7">Rejected</TabsTrigger>
        <TabsTrigger value="all" className="text-xs h-7">All</TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-md">
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
  const enhanceLabel = message.enhanced_type === 'emoji'
    ? 'Emoji'
    : message.enhanced_type === 'translated'
    ? message.language.toUpperCase()
    : null

  return (
    <div className="border border-border rounded-md p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-sm truncate">{message.name}</span>
          <span className="text-xs text-muted-foreground shrink-0">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </span>
          {message.email && (
            <span className="text-xs text-muted-foreground truncate hidden sm:inline">
              {message.email}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {enhanceLabel && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {enhanceLabel}
            </Badge>
          )}
          <Badge 
            variant={message.status === 'approved' ? 'default' : message.status === 'rejected' ? 'destructive' : 'secondary'}
            className="text-[10px] px-1.5 py-0"
          >
            {message.status}
          </Badge>
        </div>
      </div>
      
      <p className={`text-sm mb-3 ${message.enhanced_type === 'emoji' ? 'text-xl' : ''}`}>
        {message.message}
      </p>
      
      {message.original_message && (
        <p className="text-xs text-muted-foreground mb-3">
          Original: {message.original_message}
        </p>
      )}

      {message.status === 'pending' && (
        <div className="flex items-center gap-2 pt-3 border-t border-border">
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
            className="h-8 gap-1"
          >
            {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">Approve</span>
          </Button>
          <Button
            onClick={onReject}
            disabled={isProcessing}
            variant="outline"
            size="sm"
            className="h-8 gap-1"
          >
            {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">Reject</span>
          </Button>
        </div>
      )}

      {message.status !== 'pending' && message.moderated_by && (
        <p className="text-[10px] text-muted-foreground pt-2 border-t border-border">
          Moderated by {message.moderated_by}
          {message.moderation_notes && ` - ${message.moderation_notes}`}
        </p>
      )}
    </div>
  )
}
