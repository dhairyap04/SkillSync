import React from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  status?: 'online' | 'offline' | 'away' | 'busy'
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', status, ...props }, ref) => {
    const sizeClasses = {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
      xl: 'h-16 w-16 text-lg',
      '2xl': 'h-20 w-20 text-xl'
    }
    
    const statusClasses = {
      online: 'bg-success-500',
      offline: 'bg-neutral-400',
      away: 'bg-orange-500',
      busy: 'bg-red-500'
    }
    
    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    
    return (
      <div className="relative inline-block" ref={ref} {...props}>
        <div
          className={cn(
            'relative flex items-center justify-center rounded-full bg-neutral-200 text-neutral-600 font-medium overflow-hidden',
            sizeClasses[size],
            className
          )}
        >
          {src ? (
            <img
              src={src}
              alt={alt || 'Avatar'}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{fallback ? getInitials(fallback) : '?'}</span>
          )}
        </div>
        {status && (
          <div
            className={cn(
              'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white',
              statusClasses[status]
            )}
          />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export { Avatar }

