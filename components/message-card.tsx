import { GuestbookMessage } from '@/lib/db'
import { formatDistanceToNow } from 'date-fns'

interface MessageCardProps {
  message: GuestbookMessage
  showStatus?: boolean
}

export function MessageCard({ message, showStatus = false }: MessageCardProps) {
  return (
    <article className="border border-border rounded p-4">
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <span className="text-sm font-medium">{message.name}</span>
        <div className="flex items-center gap-2">
          {message.enhanced_type !== 'original' && (
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              {message.enhanced_type === 'emoji' ? 'emoji' : message.language}
            </span>
          )}
          {showStatus && (
            <span className={`text-[10px] uppercase tracking-wide ${
              message.status === 'approved' 
                ? 'text-foreground' 
                : message.status === 'rejected' 
                ? 'text-destructive' 
                : 'text-muted-foreground'
            }`}>
              {message.status}
            </span>
          )}
          <time className="text-[11px] text-muted-foreground">
            {formatDistanceToNow(new Date(message.approved_at || message.created_at), { addSuffix: true })}
          </time>
        </div>
      </div>
      
      <p className={`text-sm leading-relaxed ${message.enhanced_type === 'emoji' ? 'text-lg' : ''}`}>
        {message.message}
      </p>
      
      {message.original_message && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          Original: {message.original_message}
        </p>
      )}
    </article>
  )
}
