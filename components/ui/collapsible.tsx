'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface CollapsibleProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export function Collapsible({ open, onOpenChange, children, className }: CollapsibleProps) {
  return (
    <div className={cn('w-full', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            open,
            onOpenChange,
          })
        }
        return child
      })}
    </div>
  )
}

interface CollapsibleTriggerProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  asChild?: boolean
}

export function CollapsibleTrigger({ 
  children, 
  open = false, 
  onOpenChange, 
  className,
  asChild = false
}: CollapsibleTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      onClick: (e: React.MouseEvent) => {
        children.props.onClick?.(e)
        onOpenChange?.(!open)
      },
      className: cn(children.props.className, className),
    })
  }

  return (
    <button
      onClick={() => onOpenChange?.(!open)}
      className={cn(
        'flex w-full items-center justify-between p-4 text-left font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        className
      )}
    >
      {children}
    </button>
  )
}

interface CollapsibleContentProps {
  children: React.ReactNode
  open?: boolean
  className?: string
}

export function CollapsibleContent({ 
  children, 
  open = false, 
  className 
}: CollapsibleContentProps) {
  return (
    <div
      className={cn(
        'overflow-hidden transition-all duration-200',
        open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      )}
    >
      <div className={cn('p-4 pt-0', className)}>
        {children}
      </div>
    </div>
  )
}
