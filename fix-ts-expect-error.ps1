# Script para remover todas as diretivas @ts-expect-error não utilizadas
Get-ChildItem hooks/*.ts | ForEach-Object {
    $content = Get-Content $_.FullName
    $newContent = $content | Where-Object { $_ -notmatch '@ts-expect-error' }
    $newContent | Set-Content $_.FullName
    Write-Host "Processado: $($_.Name)"
}
Write-Host "Concluído!"
