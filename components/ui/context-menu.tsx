'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ContextMenuProps {
  children: React.ReactNode
  className?: string
}

export function ContextMenu({ children, className }: ContextMenuProps) {
  const [open, setOpen] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const menuRef = React.useRef<HTMLDivElement>(null)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setPosition({ x: e.clientX, y: e.clientY })
    setOpen(true)
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpen(false)
    }
  }

  React.useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <div className={cn('relative', className)}>
      <div onContextMenu={handleContextMenu}>
        {children}
      </div>
      
      {open && (
        <div
          ref={menuRef}
          className="fixed z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          {/* Menu content will be rendered here */}
        </div>
      )}
    </div>
  )
}

interface ContextMenuTriggerProps {
  children: React.ReactNode
  className?: string
}

export function ContextMenuTrigger({ children, className }: ContextMenuTriggerProps) {
  return <div className={className}>{children}</div>
}

interface ContextMenuContentProps {
  children: React.ReactNode
  className?: string
}

export function ContextMenuContent({ children, className }: ContextMenuContentProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {children}
    </div>
  )
}

interface ContextMenuItemProps {
  children: React.ReactNode
  onSelect?: () => void
  className?: string
  disabled?: boolean
}

export function ContextMenuItem({ 
  children, 
  onSelect, 
  className, 
  disabled = false 
}: ContextMenuItemProps) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
        className
      )}
    >
      {children}
    </button>
  )
}

interface ContextMenuSeparatorProps {
  className?: string
}

export function ContextMenuSeparator({ className }: ContextMenuSeparatorProps) {
  return (
    <div className={cn('-mx-1 my-1 h-px bg-border', className)} />
  )
}
