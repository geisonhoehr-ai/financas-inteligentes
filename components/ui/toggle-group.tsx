'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ToggleGroupProps {
  type?: 'single' | 'multiple'
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  children: React.ReactNode
  className?: string
}

export function ToggleGroup({ 
  type = 'single', 
  value, 
  onValueChange, 
  children, 
  className 
}: ToggleGroupProps) {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(() => {
    if (type === 'single') {
      return value ? [value as string] : []
    }
    return (value as string[]) || []
  })

  const handleValueChange = (itemValue: string) => {
    if (type === 'single') {
      const newValue = selectedValues.includes(itemValue) ? '' : itemValue
      setSelectedValues(newValue ? [newValue] : [])
      onValueChange?.(newValue)
    } else {
      const newValue = selectedValues.includes(itemValue)
        ? selectedValues.filter(item => item !== itemValue)
        : [...selectedValues, itemValue]
      setSelectedValues(newValue)
      onValueChange?.(newValue)
    }
  }

  return (
    <div className={cn('inline-flex items-center space-x-1', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            pressed: selectedValues.includes(child.props.value),
            onPressedChange: () => handleValueChange(child.props.value),
          })
        }
        return child
      })}
    </div>
  )
}

interface ToggleGroupItemProps {
  value: string
  children: React.ReactNode
  pressed?: boolean
  onPressedChange?: () => void
  className?: string
  disabled?: boolean
}

export function ToggleGroupItem({ 
  value, 
  children, 
  pressed = false, 
  onPressedChange, 
  className,
  disabled = false
}: ToggleGroupItemProps) {
  return (
    <button
      onClick={onPressedChange}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
        pressed && 'bg-accent text-accent-foreground',
        'h-10 px-3',
        className
      )}
    >
      {children}
    </button>
  )
}
