'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ResizableProps {
  children: React.ReactNode
  className?: string
  direction?: 'horizontal' | 'vertical' | 'both'
  minSize?: number
  maxSize?: number
  defaultSize?: number
  onResize?: (size: number) => void
}

export function Resizable({ 
  children, 
  className, 
  direction = 'horizontal',
  minSize = 100,
  maxSize = 800,
  defaultSize = 300,
  onResize
}: ResizableProps) {
  const [size, setSize] = React.useState(defaultSize)
  const [isResizing, setIsResizing] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    let newSize = 0

    if (direction === 'horizontal') {
      newSize = e.clientX - rect.left
    } else if (direction === 'vertical') {
      newSize = e.clientY - rect.top
    }

    newSize = Math.max(minSize, Math.min(maxSize, newSize))
    setSize(newSize)
    onResize?.(newSize)
  }, [isResizing, direction, minSize, maxSize, onResize])

  const handleMouseUp = React.useCallback(() => {
    setIsResizing(false)
  }, [])

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={{
        [direction === 'horizontal' ? 'width' : 'height']: `${size}px`,
      }}
    >
      {children}
      
      {/* Resize handle */}
      <div
        className={cn(
          'absolute bg-border hover:bg-primary/50 transition-colors',
          direction === 'horizontal' 
            ? 'right-0 top-0 h-full w-1 cursor-col-resize' 
            : 'bottom-0 left-0 w-full h-1 cursor-row-resize'
        )}
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}

interface ResizableHandleProps {
  className?: string
  direction?: 'horizontal' | 'vertical'
}

export function ResizableHandle({ 
  className, 
  direction = 'horizontal' 
}: ResizableHandleProps) {
  return (
    <div
      className={cn(
        'bg-border hover:bg-primary/50 transition-colors',
        direction === 'horizontal' 
          ? 'w-1 cursor-col-resize' 
          : 'h-1 cursor-row-resize',
        className
      )}
    />
  )
}

interface ResizablePanelProps {
  children: React.ReactNode
  className?: string
  defaultSize?: number
  minSize?: number
  maxSize?: number
}

export function ResizablePanel({ 
  children, 
  className, 
  defaultSize = 50,
  minSize = 10,
  maxSize = 90
}: ResizablePanelProps) {
  return (
    <div className={cn('flex-1', className)}>
      {children}
    </div>
  )
}

interface ResizableGroupProps {
  children: React.ReactNode
  className?: string
  direction?: 'horizontal' | 'vertical'
}

export function ResizableGroup({ 
  children, 
  className, 
  direction = 'horizontal' 
}: ResizableGroupProps) {
  return (
    <div
      className={cn(
        'flex',
        direction === 'vertical' ? 'flex-col' : 'flex-row',
        className
      )}
    >
      {children}
    </div>
  )
}
