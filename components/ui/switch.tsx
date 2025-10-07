'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-4 w-7',
  md: 'h-5 w-9',
  lg: 'h-6 w-11',
}

const thumbSizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

export function Switch({ size = 'md', className, ...props }: SwitchProps) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        {...props}
      />
      <div
        className={cn(
          'relative inline-flex items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          props.checked ? 'bg-primary' : 'bg-muted',
          sizeClasses[size],
          className
        )}
      >
        <span
          className={cn(
            'inline-block rounded-full bg-white shadow-lg transform transition-transform',
            props.checked ? 'translate-x-full' : 'translate-x-0',
            thumbSizeClasses[size]
          )}
        />
      </div>
    </label>
  )
}
