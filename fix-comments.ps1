# Script para comentar completamente todas as operações problemáticas
$files = Get-ChildItem hooks/*.tsx

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    Write-Host "Corrigindo comentários: $($file.Name)"
    
    # Comentar linhas que começam com espaços e depois código (não comentado)
    $lines = $content -split "`n"
    $newLines = @()
    
    foreach ($line in $lines) {
        if ($line -match '^\s+(\.from\(|\.insert\(|\.update\(|\.eq\(|\.select\(|\.single\(|if \(error\)|return data|return error)') {
            $newLines += "// $line"
        } else {
            $newLines += $line
        }
    }
    
    $newContent = $newLines -join "`n"
    Set-Content $file.FullName $newContent
}

Write-Host "Concluído!"
