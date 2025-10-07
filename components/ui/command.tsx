'use client'

import * as React from 'react'
import { Search, Command as CommandIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandProps {
  children: React.ReactNode
  className?: string
}

export function Command({ children, className }: CommandProps) {
  return (
    <div className={cn('relative w-full max-w-lg', className)}>
      {children}
    </div>
  )
}

interface CommandInputProps {
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

export function CommandInput({ 
  placeholder = 'Digite um comando...', 
  value, 
  onValueChange, 
  className 
}: CommandInputProps) {
  const [inputValue, setInputValue] = React.useState(value || '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-10 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 hover:border-input/80"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </div>
  )
}

interface CommandListProps {
  children: React.ReactNode
  className?: string
}

export function CommandList({ children, className }: CommandListProps) {
  return (
    <div className={cn('max-h-64 overflow-y-auto overflow-x-hidden', className)}>
      {children}
    </div>
  )
}

interface CommandEmptyProps {
  children: React.ReactNode
  className?: string
}

export function CommandEmpty({ children, className }: CommandEmptyProps) {
  return (
    <div className={cn('py-6 text-center text-sm text-muted-foreground', className)}>
      {children}
    </div>
  )
}

interface CommandGroupProps {
  heading?: string
  children: React.ReactNode
  className?: string
}

export function CommandGroup({ heading, children, className }: CommandGroupProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {heading && (
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          {heading}
        </div>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  )
}

interface CommandItemProps {
  value: string
  children: React.ReactNode
  onSelect?: () => void
  className?: string
  disabled?: boolean
}

export function CommandItem({ 
  value, 
  children, 
  onSelect, 
  className, 
  disabled = false 
}: CommandItemProps) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
        className
      )}
    >
      {children}
    </button>
  )
}

interface CommandSeparatorProps {
  className?: string
}

export function CommandSeparator({ className }: CommandSeparatorProps) {
  return (
    <div className={cn('-mx-1 h-px bg-border', className)} />
  )
}
