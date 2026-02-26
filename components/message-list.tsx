'use client'

import { GuestbookMessage } from '@/lib/db'
import { MessageCard } from './message-card'

interface MessageListProps {
  messages: GuestbookMessage[]
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-muted-foreground">No entries yet</p>
        <p className="text-xs text-muted-foreground mt-1">Be the first to sign the directory</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </div>
  )
}
