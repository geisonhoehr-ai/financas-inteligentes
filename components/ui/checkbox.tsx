'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

const iconSizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

export function Checkbox({ size = 'md', className, ...props }: CheckboxProps) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        {...props}
      />
      <div
        className={cn(
          'relative inline-flex items-center justify-center rounded border-2 border-input bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          props.checked ? 'bg-primary border-primary' : 'hover:bg-accent',
          sizeClasses[size],
          className
        )}
      >
        {props.checked && (
          <Check
            className={cn(
              'text-primary-foreground',
              iconSizeClasses[size]
            )}
          />
        )}
      </div>
    </label>
  )
}
