'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface PopoverProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  trigger: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function Popover({ 
  open, 
  onOpenChange, 
  children, 
  trigger, 
  side = 'bottom',
  className 
}: PopoverProps) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const triggerRef = React.useRef<HTMLDivElement>(null)

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const popoverWidth = 300 // Approximate popover width
    const popoverHeight = 200 // Approximate popover height

    let x = 0
    let y = 0

    switch (side) {
      case 'top':
        x = rect.left + rect.width / 2 - popoverWidth / 2
        y = rect.top - popoverHeight - 8
        break
      case 'bottom':
        x = rect.left + rect.width / 2 - popoverWidth / 2
        y = rect.bottom + 8
        break
      case 'left':
        x = rect.left - popoverWidth - 8
        y = rect.top + rect.height / 2 - popoverHeight / 2
        break
      case 'right':
        x = rect.right + 8
        y = rect.top + rect.height / 2 - popoverHeight / 2
        break
    }

    setPosition({ x, y })
  }, [side])

  React.useEffect(() => {
    if (open) {
      updatePosition()
    }
  }, [open, updatePosition])

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onClick={() => onOpenChange(!open)}
      >
        {trigger}
      </div>
      
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => onOpenChange(false)}
          />
          <div
            className={cn(
              'fixed z-50 rounded-lg border bg-popover p-4 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
              className
            )}
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
          >
            {children}
          </div>
        </>
      )}
    </div>
  )
}

interface PopoverContentProps {
  children: React.ReactNode
  className?: string
}

export function PopoverContent({ children, className }: PopoverContentProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
    </div>
  )
}

interface PopoverTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

export function PopoverTrigger({ children, asChild }: PopoverTriggerProps) {
  return <>{children}</>
}
