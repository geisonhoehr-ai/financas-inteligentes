# Script para comentar operações problemáticas em todos os hooks
$files = Get-ChildItem hooks/*.tsx

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    Write-Host "Processando: $($file.Name)"
    
    # Comentar operações de insert
    $content = $content -replace '(\s+)(const \{ data, error \} = await supabase\s+\.from\([^)]+\)\s+\.insert\([^)]+\))', '$1// TODO: Implementar quando tipos estiverem corretos`n$1console.log("Operação desabilitada temporariamente")`n$1throw new Error("Funcionalidade temporariamente desabilitada")`n$1// $2'
    
    # Comentar operações de update
    $content = $content -replace '(\s+)(const \{ data, error \} = await supabase\s+\.from\([^)]+\)\s+\.update\([^)]+\))', '$1// TODO: Implementar quando tipos estiverem corretos`n$1console.log("Operação desabilitada temporariamente")`n$1throw new Error("Funcionalidade temporariamente desabilitada")`n$1// $2'
    
    # Comentar chamadas RPC
    $content = $content -replace '(\s+)(const \{ [^}]+ \} = await supabase\.rpc\([^)]+\))', '$1// TODO: Implementar quando tipos estiverem corretos`n$1console.log("RPC desabilitado temporariamente")`n$1throw new Error("Funcionalidade temporariamente desabilitada")`n$1// $2'
    
    Set-Content $file.FullName $content
}

Write-Host "Concluído!"
