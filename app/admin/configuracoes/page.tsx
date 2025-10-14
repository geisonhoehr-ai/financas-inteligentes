'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { 
  Settings, 
  Save, 
  Mail, 
  Shield, 
  Bell,
  Globe,
  Database,
  AlertTriangle
} from 'lucide-react'
import { showToast } from '@/lib/toast'

export default function AdminConfiguracoesPage() {
  const [configs, setConfigs] = useState({
    // Sistema
    systemName: 'Controle Financeiro Familiar',
    systemDescription: 'Sistema completo para controle financeiro familiar e empresarial',
    maintenanceMode: false,
    
    // Email
    emailProvider: 'smtp',
    emailHost: 'smtp.gmail.com',
    emailPort: 587,
    emailUser: '',
    emailPassword: '',
    emailFrom: 'noreply@controlefinanceiro.com',
    
    // Notificações
    enableEmailNotifications: true,
    enablePushNotifications: true,
    enableSmsNotifications: false,
    
    // Segurança
    passwordMinLength: 8,
    passwordRequireSpecialChars: true,
    sessionTimeout: 30, // minutos
    maxLoginAttempts: 5,
    
    // Limites padrão
    defaultMaxMembers: 2,
    defaultMaxFamilies: 1,
    defaultMaxTransactions: 50,
    
    // Backup
    autoBackupEnabled: true,
    backupFrequency: 'daily', // daily, weekly, monthly
    backupRetention: 30, // dias
    
    // Analytics
    enableAnalytics: true,
    enableErrorTracking: true,
    logLevel: 'info', // debug, info, warn, error
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleConfigChange = (key: string, value: any) => {
    setConfigs(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Implementar salvamento no banco de dados
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay
      showToast.success('Configurações salvas com sucesso!')
    } catch (error) {
      showToast.error('Erro ao salvar configurações')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                Configurações do Sistema
              </h1>
              <p className="text-muted-foreground mt-2">
                Configure parâmetros globais e comportamento do sistema
              </p>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Salvar Configurações
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configurações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="systemName">Nome do Sistema</Label>
                <Input
                  id="systemName"
                  value={configs.systemName}
                  onChange={(e) => handleConfigChange('systemName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemDescription">Descrição</Label>
                <Textarea
                  id="systemDescription"
                  value={configs.systemDescription}
                  onChange={(e) => handleConfigChange('systemDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode">Modo de Manutenção</Label>
                  <p className="text-sm text-muted-foreground">
                    Bloquear acesso de usuários durante manutenção
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={configs.maintenanceMode}
                  onChange={(e) => handleConfigChange('maintenanceMode', e.target.checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Configurações de Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailHost">Servidor SMTP</Label>
                <Input
                  id="emailHost"
                  value={configs.emailHost}
                  onChange={(e) => handleConfigChange('emailHost', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailPort">Porta</Label>
                  <Input
                    id="emailPort"
                    type="number"
                    value={configs.emailPort}
                    onChange={(e) => handleConfigChange('emailPort', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailFrom">Email Remetente</Label>
                  <Input
                    id="emailFrom"
                    type="email"
                    value={configs.emailFrom}
                    onChange={(e) => handleConfigChange('emailFrom', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailUser">Usuário SMTP</Label>
                <Input
                  id="emailUser"
                  value={configs.emailUser}
                  onChange={(e) => handleConfigChange('emailUser', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailPassword">Senha SMTP</Label>
                <Input
                  id="emailPassword"
                  type="password"
                  value={configs.emailPassword}
                  onChange={(e) => handleConfigChange('emailPassword', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Notificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableEmailNotifications">Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar notificações importantes por email
                  </p>
                </div>
                <Switch
                  id="enableEmailNotifications"
                  checked={configs.enableEmailNotifications}
                  onChange={(e) => handleConfigChange('enableEmailNotifications', e.target.checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enablePushNotifications">Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificações em tempo real no navegador
                  </p>
                </div>
                <Switch
                  id="enablePushNotifications"
                  checked={configs.enablePushNotifications}
                  onChange={(e) => handleConfigChange('enablePushNotifications', e.target.checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableSmsNotifications">Notificações SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar alertas críticos por SMS
                  </p>
                </div>
                <Switch
                  id="enableSmsNotifications"
                  checked={configs.enableSmsNotifications}
                  onChange={(e) => handleConfigChange('enableSmsNotifications', e.target.checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Tamanho Mínimo da Senha</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={configs.passwordMinLength}
                    onChange={(e) => handleConfigChange('passwordMinLength', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Timeout da Sessão (min)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={configs.sessionTimeout}
                    onChange={(e) => handleConfigChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="passwordRequireSpecialChars">Exigir Caracteres Especiais</Label>
                  <p className="text-sm text-muted-foreground">
                    Senhas devem conter símbolos especiais
                  </p>
                </div>
                <Switch
                  id="passwordRequireSpecialChars"
                  checked={configs.passwordRequireSpecialChars}
                  onChange={(e) => handleConfigChange('passwordRequireSpecialChars', e.target.checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Máximo de Tentativas de Login</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={configs.maxLoginAttempts}
                  onChange={(e) => handleConfigChange('maxLoginAttempts', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Backup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup e Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoBackupEnabled">Backup Automático</Label>
                  <p className="text-sm text-muted-foreground">
                    Fazer backup automático dos dados
                  </p>
                </div>
                <Switch
                  id="autoBackupEnabled"
                  checked={configs.autoBackupEnabled}
                  onChange={(e) => handleConfigChange('autoBackupEnabled', e.target.checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Frequência do Backup</Label>
                  <select
                    id="backupFrequency"
                    value={configs.backupFrequency}
                    onChange={(e) => handleConfigChange('backupFrequency', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="daily">Diário</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupRetention">Retenção (dias)</Label>
                  <Input
                    id="backupRetention"
                    type="number"
                    value={configs.backupRetention}
                    onChange={(e) => handleConfigChange('backupRetention', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Monitoramento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableAnalytics">Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Coletar dados de uso para melhorias
                  </p>
                </div>
                <Switch
                  id="enableAnalytics"
                  checked={configs.enableAnalytics}
                  onChange={(e) => handleConfigChange('enableAnalytics', e.target.checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableErrorTracking">Rastreamento de Erros</Label>
                  <p className="text-sm text-muted-foreground">
                    Monitorar e reportar erros automaticamente
                  </p>
                </div>
                <Switch
                  id="enableErrorTracking"
                  checked={configs.enableErrorTracking}
                  onChange={(e) => handleConfigChange('enableErrorTracking', e.target.checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logLevel">Nível de Log</Label>
                <select
                  id="logLevel"
                  value={configs.logLevel}
                  onChange={(e) => handleConfigChange('logLevel', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="debug">Debug</option>
                  <option value="info">Info</option>
                  <option value="warn">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
