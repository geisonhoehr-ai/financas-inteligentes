# Script para restaurar os hooks
$files = Get-ChildItem hooks/*.tsx

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    Write-Host "Restaurando: $($file.Name)"
    
    # Remover blocos de código comentado
    $content = $content -replace '// TODO: Implementar quando.*?\n.*?throw new Error.*?\n', ''
    
    # Remover comentários de linhas individuais
    $content = $content -replace '//\s*const.*$', ''
    $content = $content -replace '//\s*if.*$', ''
    $content = $content -replace '//\s*return.*$', ''
    
    # Restaurar chamadas RPC
    $content = $content -replace '// const \{ data, error \}', 'const { data, error }'
    $content = $content -replace '// if \(error\)', 'if (error)'
    $content = $content -replace '// return', 'return'
    
    Set-Content $file.FullName $content
}

Write-Host "Concluído!"
