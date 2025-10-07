'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ScrollAreaProps {
  children: React.ReactNode
  className?: string
  orientation?: 'vertical' | 'horizontal' | 'both'
}

export function ScrollArea({ 
  children, 
  className, 
  orientation = 'vertical' 
}: ScrollAreaProps) {
  const [scrollPosition, setScrollPosition] = React.useState({ x: 0, y: 0 })
  const [isScrolling, setIsScrolling] = React.useState(false)
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)

  const handleScroll = React.useCallback(() => {
    if (!scrollAreaRef.current) return

    const { scrollLeft, scrollTop } = scrollAreaRef.current
    setScrollPosition({ x: scrollLeft, y: scrollTop })
  }, [])

  const handleMouseEnter = () => {
    setIsScrolling(true)
  }

  const handleMouseLeave = () => {
    setIsScrolling(false)
  }

  React.useEffect(() => {
    const scrollArea = scrollAreaRef.current
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll)
      return () => scrollArea.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        ref={scrollAreaRef}
        className={cn(
          'h-full w-full overflow-auto',
          orientation === 'vertical' && 'overflow-y-auto overflow-x-hidden',
          orientation === 'horizontal' && 'overflow-x-auto overflow-y-hidden',
          orientation === 'both' && 'overflow-auto'
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={contentRef}>
          {children}
        </div>
      </div>
      
      {/* Custom scrollbars */}
      {isScrolling && (
        <>
          {orientation === 'vertical' || orientation === 'both' ? (
            <div className="absolute right-0 top-0 h-full w-2 bg-transparent">
              <div
                className="absolute right-0 top-0 w-full bg-muted-foreground/20 rounded-full"
                style={{
                  height: '100%',
                  transform: `translateY(${scrollPosition.y}px)`,
                }}
              />
            </div>
          ) : null}
          
          {orientation === 'horizontal' || orientation === 'both' ? (
            <div className="absolute bottom-0 left-0 w-full h-2 bg-transparent">
              <div
                className="absolute bottom-0 left-0 h-full bg-muted-foreground/20 rounded-full"
                style={{
                  width: '100%',
                  transform: `translateX(${scrollPosition.x}px)`,
                }}
              />
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

interface ScrollBarProps {
  orientation?: 'vertical' | 'horizontal'
  className?: string
}

export function ScrollBar({ 
  orientation = 'vertical', 
  className 
}: ScrollBarProps) {
  return (
    <div
      className={cn(
        'flex touch-none select-none transition-colors',
        orientation === 'vertical' 
          ? 'h-full w-2.5 border-l border-l-transparent p-[1px]' 
          : 'h-2.5 flex-col border-t border-t-transparent p-[1px]',
        className
      )}
    >
      <div className="relative flex-1 rounded-full bg-border" />
    </div>
  )
}
