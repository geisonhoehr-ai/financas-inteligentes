'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionProps {
  type?: 'single' | 'multiple'
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  children: React.ReactNode
  className?: string
}

export function Accordion({ 
  type = 'single', 
  value, 
  onValueChange, 
  children, 
  className 
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(() => {
    if (type === 'single') {
      return value ? [value as string] : []
    }
    return (value as string[]) || []
  })

  const handleValueChange = (itemValue: string) => {
    if (type === 'single') {
      const newValue = openItems.includes(itemValue) ? '' : itemValue
      setOpenItems(newValue ? [newValue] : [])
      onValueChange?.(newValue)
    } else {
      const newValue = openItems.includes(itemValue)
        ? openItems.filter(item => item !== itemValue)
        : [...openItems, itemValue]
      setOpenItems(newValue)
      onValueChange?.(newValue)
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            isOpen: openItems.includes(child.props.value),
            onToggle: () => handleValueChange(child.props.value),
          })
        }
        return child
      })}
    </div>
  )
}

interface AccordionItemProps {
  value: string
  children: React.ReactNode
  isOpen?: boolean
  onToggle?: () => void
  className?: string
}

export function AccordionItem({ 
  value, 
  children, 
  isOpen = false, 
  onToggle, 
  className 
}: AccordionItemProps) {
  return (
    <div className={cn('border rounded-lg', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            isOpen,
            onToggle,
          })
        }
        return child
      })}
    </div>
  )
}

interface AccordionTriggerProps {
  children: React.ReactNode
  isOpen?: boolean
  onToggle?: () => void
  className?: string
}

export function AccordionTrigger({ 
  children, 
  isOpen = false, 
  onToggle, 
  className 
}: AccordionTriggerProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'flex w-full items-center justify-between p-4 text-left font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        className
      )}
    >
      {children}
      <ChevronDown
        className={cn(
          'h-4 w-4 transition-transform duration-200',
          isOpen && 'rotate-180'
        )}
      />
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  isOpen?: boolean
  className?: string
}

export function AccordionContent({ 
  children, 
  isOpen = false, 
  className 
}: AccordionContentProps) {
  return (
    <div
      className={cn(
        'overflow-hidden transition-all duration-200',
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      )}
    >
      <div className={cn('p-4 pt-0', className)}>
        {children}
      </div>
    </div>
  )
}
