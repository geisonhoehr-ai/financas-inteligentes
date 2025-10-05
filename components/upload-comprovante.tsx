'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { showToast } from '@/lib/toast'
import { Upload, X, FileText, Image as ImageIcon, Loader2, Check } from 'lucide-react'

interface UploadComprovanteProps {
  dividaId: string
  onUploadSuccess?: (url: string) => void
  onCancel?: () => void
  comprovanteAtual?: string | null
}

export function UploadComprovante({
  dividaId,
  onUploadSuccess,
  onCancel,
  comprovanteAtual
}: UploadComprovanteProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      showToast.error('Tipo de arquivo não permitido. Use JPG, PNG, WEBP ou PDF.')
      return
    }

    // Validar tamanho (5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB em bytes
    if (file.size > maxSize) {
      showToast.error('Arquivo muito grande. Tamanho máximo: 5MB')
      return
    }

    setSelectedFile(file)

    // Gerar preview se for imagem
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null) // PDF não tem preview
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast.error('Selecione um arquivo primeiro')
      return
    }

    setUploading(true)

    try {
      // Obter usuário atual
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      // Gerar nome do arquivo
      const timestamp = new Date().getTime()
      const random = Math.random().toString(36).substring(7)
      const extension = selectedFile.name.split('.').pop()
      const fileName = `${user.id}/${dividaId}_${timestamp}_${random}.${extension}`

      // Upload para Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('comprovantes')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      // Salvar URL no banco usando a função SQL
      const { error: saveError } = await supabase
        .rpc('salvar_comprovante_divida', {
          p_divida_id: dividaId,
          p_comprovante_url: uploadData.path
        })

      if (saveError) {
        // Se falhar ao salvar, tentar deletar o arquivo
        await supabase.storage.from('comprovantes').remove([fileName])
        throw saveError
      }

      showToast.success('Comprovante enviado com sucesso!')
      onUploadSuccess?.(uploadData.path)

      // Limpar estado
      setSelectedFile(null)
      setPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (error: any) {
      console.error('Erro ao fazer upload:', error)
      showToast.error(`Erro ao enviar comprovante: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getComprovanteUrl = async (path: string) => {
    const { data } = await supabase.storage
      .from('comprovantes')
      .createSignedUrl(path, 3600) // URL válida por 1 hora

    return data?.signedUrl
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Comprovante de Pagamento</h3>
          <p className="text-xs text-muted-foreground">
            Envie uma foto ou PDF do comprovante (máx. 5MB)
          </p>
        </div>

        {/* Input de arquivo */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Preview ou botão de seleção */}
        {!selectedFile && !comprovanteAtual && (
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed hover:border-primary/50"
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Clique para selecionar arquivo
              </span>
              <span className="text-xs text-muted-foreground">
                JPG, PNG, WEBP ou PDF (máx. 5MB)
              </span>
            </div>
          </Button>
        )}

        {/* Preview do arquivo selecionado */}
        {selectedFile && (
          <div className="space-y-3">
            <div className="relative">
              {preview ? (
                // Preview de imagem
                <div className="relative rounded-lg overflow-hidden border-2 border-primary/20">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={handleRemove}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                // Preview de PDF
                <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-primary/20 bg-muted/50">
                  <FileText className="h-10 w-10 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleRemove}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Botões de ação */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={uploading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Enviar Comprovante
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Comprovante já enviado */}
        {comprovanteAtual && !selectedFile && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  Comprovante enviado
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  O comprovante foi anexado à dívida
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Substituir Comprovante
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
