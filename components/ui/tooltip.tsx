'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function Tooltip({ children, content, side = 'top', className }: TooltipProps) {
  const [open, setOpen] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const triggerRef = React.useRef<HTMLDivElement>(null)

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const tooltipWidth = 200 // Approximate tooltip width
    const tooltipHeight = 40 // Approximate tooltip height

    let x = 0
    let y = 0

    switch (side) {
      case 'top':
        x = rect.left + rect.width / 2 - tooltipWidth / 2
        y = rect.top - tooltipHeight - 8
        break
      case 'bottom':
        x = rect.left + rect.width / 2 - tooltipWidth / 2
        y = rect.bottom + 8
        break
      case 'left':
        x = rect.left - tooltipWidth - 8
        y = rect.top + rect.height / 2 - tooltipHeight / 2
        break
      case 'right':
        x = rect.right + 8
        y = rect.top + rect.height / 2 - tooltipHeight / 2
        break
    }

    setPosition({ x, y })
  }, [side])

  const handleMouseEnter = () => {
    updatePosition()
    setOpen(true)
  }

  const handleMouseLeave = () => {
    setOpen(false)
  }

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-block"
    >
      {children}
      
      {open && (
        <div
          className={cn(
            'fixed z-50 rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
            className
          )}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          {content}
        </div>
      )}
    </div>
  )
}
