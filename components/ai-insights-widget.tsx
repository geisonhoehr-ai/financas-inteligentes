'use client'

import { useEffect, useState } from 'react'
import { useAIAssistant } from '@/hooks/use-ai-assistant'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, RefreshCw, MessageSquare } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface AIInsightsWidgetProps {
  onOpenChat?: () => void
}

export function AIInsightsWidget({ onOpenChat }: AIInsightsWidgetProps) {
  const { insights, loadInsights } = useAIAssistant()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadInsights()
  }, [loadInsights])

  const handleRefresh = async () => {
    setIsLoading(true)
    await loadInsights()
    setIsLoading(false)
  }

  if (insights.length === 0 && !isLoading) {
    return null
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-sm font-medium">Insights da IA</CardTitle>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            {onOpenChat && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenChat}
                className="h-8 w-8 p-0"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <div className="space-y-2">
            {insights.map((insight, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-white/50 dark:bg-black/20 text-sm"
              >
                {insight}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
