import Link from 'next/link'
import { GuestbookMessage } from '@/lib/db'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'

interface RecentMessagePreviewProps {
  message: GuestbookMessage | null
}

export function RecentMessagePreview({ message }: RecentMessagePreviewProps) {
  if (!message) {
    return (
      <div className="border border-dashed border-border rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground mb-3">No messages yet. Be the first!</p>
        <Link href="/guestbook">
          <Button size="sm">Sign the Guestbook</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <span className="text-sm font-medium">{message.name}</span>
          <div className="flex items-center gap-2">
            {message.enhanced_type !== 'original' && (
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {message.enhanced_type === 'emoji' ? 'emoji' : message.language}
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
      </div>
      <div className="px-4 py-3 bg-muted/40 border-t border-border flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">Latest entry</span>
        <Link href="/guestbook" className="text-xs font-medium hover:underline underline-offset-2">
          View all & sign
        </Link>
      </div>
    </div>
  )
}
