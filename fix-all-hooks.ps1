# Script para comentar operações problemáticas em todos os hooks
$files = Get-ChildItem hooks/*.tsx

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Comentar operações de insert/update que podem estar causando problemas
    $content = $content -replace '(\s+)(const \{ data, error \} = await supabase\s+\.from\([^)]+\)\s+\.insert\([^)]+\))', '$1// TODO: Implementar quando tipos estiverem corretos`n$1// $2'
    $content = $content -replace '(\s+)(const \{ data, error \} = await supabase\s+\.from\([^)]+\)\s+\.update\([^)]+\))', '$1// TODO: Implementar quando tipos estiverem corretos`n$1// $2'
    
    Set-Content $file.FullName $content
    Write-Host "Processado: $($file.Name)"
}

Write-Host "Concluído!"
