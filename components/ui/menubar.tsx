'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MenubarProps {
  children: React.ReactNode
  className?: string
}

export function Menubar({ children, className }: MenubarProps) {
  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {children}
    </div>
  )
}

interface MenubarMenuProps {
  children: React.ReactNode
  className?: string
}

export function MenubarMenu({ children, className }: MenubarMenuProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
    </div>
  )
}

interface MenubarTriggerProps {
  children: React.ReactNode
  className?: string
  asChild?: boolean
}

export function MenubarTrigger({ children, className, asChild }: MenubarTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      className: cn(children.props.className, className),
    })
  }

  return (
    <button
      className={cn(
        'flex items-center space-x-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
        className
      )}
    >
      {children}
      <ChevronDown className="h-4 w-4" />
    </button>
  )
}

interface MenubarContentProps {
  children: React.ReactNode
  className?: string
}

export function MenubarContent({ children, className }: MenubarContentProps) {
  return (
    <div className={cn('absolute top-full left-0 z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md', className)}>
      {children}
    </div>
  )
}

interface MenubarItemProps {
  children: React.ReactNode
  onSelect?: () => void
  className?: string
  disabled?: boolean
}

export function MenubarItem({ 
  children, 
  onSelect, 
  className, 
  disabled = false 
}: MenubarItemProps) {
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

interface MenubarSeparatorProps {
  className?: string
}

export function MenubarSeparator({ className }: MenubarSeparatorProps) {
  return (
    <div className={cn('-mx-1 my-1 h-px bg-border', className)} />
  )
}

interface MenubarLabelProps {
  children: React.ReactNode
  className?: string
}

export function MenubarLabel({ children, className }: MenubarLabelProps) {
  return (
    <div className={cn('px-2 py-1.5 text-sm font-semibold', className)}>
      {children}
    </div>
  )
}
