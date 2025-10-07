# Script para remover comentários problemáticos
$files = Get-ChildItem hooks/*.tsx

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    Write-Host "Removendo comentários: $($file.Name)"
    
    # Remover linhas comentadas
    $lines = $content -split "`n"
    $newLines = @()
    $inCommentBlock = $false
    
    foreach ($line in $lines) {
        if ($line -match '^\s*//') {
            # Pular linhas que são apenas comentários
            continue
        }
        
        # Remover comentários no final das linhas
        $line = $line -replace '//.*$', ''
        
        # Adicionar linha se não estiver vazia
        if ($line -match '\S') {
            $newLines += $line
        }
    }
    
    $newContent = $newLines -join "`n"
    Set-Content $file.FullName $newContent
}

Write-Host "Concluído!"
