'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
}

export function Slider({ 
  value = 0, 
  onValueChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  className, 
  ...props 
}: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    onValueChange?.(newValue)
  }

  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={cn('relative w-full', className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${percentage}%, hsl(var(--muted)) ${percentage}%, hsl(var(--muted)) 100%)`
        }}
        {...props}
      />
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid hsl(var(--background));
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid hsl(var(--background));
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  )
}
