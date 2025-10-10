'use client'

import { useState } from 'react'
import { useTags } from '@/hooks/use-tags'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { X, Plus } from 'lucide-react'
import Link from 'next/link'

interface TagSelectorProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
  className?: string
}

export function TagSelector({ selectedTags, onChange, className }: TagSelectorProps) {
  const { tags } = useTags()
  const [showAll, setShowAll] = useState(false)

  const tagsExibidas = showAll ? tags : tags.slice(0, 6)
  const temMais = tags.length > 6

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter(id => id !== tagId))
    } else {
      onChange([...selectedTags, tagId])
    }
  }

  if (tags.length === 0) {
    return (
      <div className={className}>
        <Label>Tags</Label>
        <div className="mt-2 p-4 border-2 border-dashed rounded-xl text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Você ainda não tem tags criadas
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            asChild
          >
            <Link href="/tags">
              <Plus className="h-3 w-3 mr-1" />
              Criar Tags
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <Label>Tags (opcional)</Label>
      <div className="mt-2 space-y-2">
        <div className="flex flex-wrap gap-2">
          {tagsExibidas.map((tag) => {
            const isSelected = selectedTags.includes(tag.id)
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                  transition-all hover:scale-105 border-2
                  ${isSelected 
                    ? 'ring-2 ring-primary border-primary' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
                style={{
                  backgroundColor: isSelected ? tag.cor + '30' : tag.cor + '10',
                  color: tag.cor,
                }}
              >
                <span>{tag.icone}</span>
                <span>{tag.nome}</span>
                {isSelected && <X className="h-3 w-3" />}
              </button>
            )
          })}
        </div>

        {temMais && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-xs"
          >
            {showAll ? 'Mostrar menos' : `Mostrar mais ${tags.length - 6} tags`}
          </Button>
        )}

        {selectedTags.length > 0 && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''} selecionada{selectedTags.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


