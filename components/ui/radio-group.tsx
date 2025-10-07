'use client'

import * as React from 'react'
import { Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RadioGroupProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function RadioGroup({ value, onValueChange, children, className }: RadioGroupProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            checked: child.props.value === value,
            onSelect: () => onValueChange(child.props.value),
          })
        }
        return child
      })}
    </div>
  )
}

interface RadioGroupItemProps {
  value: string
  children: React.ReactNode
  checked?: boolean
  onSelect?: () => void
  className?: string
}

export function RadioGroupItem({ 
  value, 
  children, 
  checked = false, 
  onSelect, 
  className 
}: RadioGroupItemProps) {
  return (
    <label className={cn('flex items-center space-x-2 cursor-pointer', className)}>
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={onSelect}
        className="sr-only"
      />
      <div
        className={cn(
          'relative inline-flex items-center justify-center rounded-full border-2 border-input bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-primary border-primary' : 'hover:bg-accent',
          'h-5 w-5'
        )}
      >
        {checked && (
          <Circle className="h-2.5 w-2.5 text-primary-foreground fill-current" />
        )}
      </div>
      <span className="text-sm font-medium">{children}</span>
    </label>
  )
}
