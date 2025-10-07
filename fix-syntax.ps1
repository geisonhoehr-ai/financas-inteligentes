# Script para corrigir erros de sintaxe nos hooks
$files = Get-ChildItem hooks/*.tsx

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    Write-Host "Corrigindo: $($file.Name)"
    
    # Corrigir quebras de linha incorretas
    $content = $content -replace '`n', ''
    
    # Corrigir aspas duplas para aspas simples
    $content = $content -replace '"Operação desabilitada temporariamente"', "'Operação desabilitada temporariamente'"
    $content = $content -replace '"Funcionalidade temporariamente desabilitada"', "'Funcionalidade temporariamente desabilitada'"
    $content = $content -replace '"RPC desabilitado temporariamente"', "'RPC desabilitado temporariamente'"
    
    Set-Content $file.FullName $content
}

Write-Host "Concluído!"
