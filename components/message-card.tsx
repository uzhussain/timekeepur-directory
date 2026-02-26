import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GuestbookMessage } from '@/lib/db'
import { Sparkles, Globe, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface MessageCardProps {
  message: GuestbookMessage
  showStatus?: boolean
}

export function MessageCard({ message, showStatus = false }: MessageCardProps) {
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
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">{message.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(message.approved_at || message.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {enhanceLabel && (
              <Badge variant="secondary" className="gap-1 text-xs">
                {enhanceIcon}
                {enhanceLabel}
              </Badge>
            )}
            {showStatus && (
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
            )}
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
      </CardContent>
    </Card>
  )
}
