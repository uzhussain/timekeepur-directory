import { Badge } from '@/components/ui/badge'
import { GuestbookMessage } from '@/lib/db'
import { formatDistanceToNow } from 'date-fns'

interface MessageCardProps {
  message: GuestbookMessage
  showStatus?: boolean
}

export function MessageCard({ message, showStatus = false }: MessageCardProps) {
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
            {formatDistanceToNow(new Date(message.approved_at || message.created_at), { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {enhanceLabel && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {enhanceLabel}
            </Badge>
          )}
          {showStatus && (
            <Badge 
              variant={message.status === 'approved' ? 'default' : message.status === 'rejected' ? 'destructive' : 'secondary'}
              className="text-[10px] px-1.5 py-0"
            >
              {message.status}
            </Badge>
          )}
        </div>
      </div>
      
      <p className={`text-sm ${message.enhanced_type === 'emoji' ? 'text-xl' : ''}`}>
        {message.message}
      </p>
      
      {message.original_message && (
        <p className="mt-2 text-xs text-muted-foreground">
          Original: {message.original_message}
        </p>
      )}
    </div>
  )
}
