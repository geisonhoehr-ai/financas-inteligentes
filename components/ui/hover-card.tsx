'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface HoverCardProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  openDelay?: number
  closeDelay?: number
}

export function HoverCard({ 
  children, 
  content, 
  side = 'top', 
  className,
  openDelay = 200,
  closeDelay = 300
}: HoverCardProps) {
  const [open, setOpen] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const cardWidth = 300 // Approximate card width
    const cardHeight = 200 // Approximate card height

    let x = 0
    let y = 0

    switch (side) {
      case 'top':
        x = rect.left + rect.width / 2 - cardWidth / 2
        y = rect.top - cardHeight - 8
        break
      case 'bottom':
        x = rect.left + rect.width / 2 - cardWidth / 2
        y = rect.bottom + 8
        break
      case 'left':
        x = rect.left - cardWidth - 8
        y = rect.top + rect.height / 2 - cardHeight / 2
        break
      case 'right':
        x = rect.right + 8
        y = rect.top + rect.height / 2 - cardHeight / 2
        break
    }

    setPosition({ x, y })
  }, [side])

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      updatePosition()
      setOpen(true)
    }, openDelay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setOpen(false)
    }, closeDelay)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      
      {open && (
        <div
          className={cn(
            'fixed z-50 w-80 rounded-lg border bg-popover p-4 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
            className
          )}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {content}
        </div>
      )}
    </div>
  )
}

interface HoverCardTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

export function HoverCardTrigger({ children, asChild }: HoverCardTriggerProps) {
  return <>{children}</>
}

interface HoverCardContentProps {
  children: React.ReactNode
  className?: string
}

export function HoverCardContent({ children, className }: HoverCardContentProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
    </div>
  )
}
