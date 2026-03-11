cd C:\Users\leo08\repos\cafeteria-backend
Write-Host "================================"
Write-Host "Iniciando Backend Server..."
Write-Host "Verificando variables de entorno..."
Write-Host ""

$envFile = ".\src\.env"
if (Test-Path $envFile) {
    Write-Host "✓ Archivo .env encontrado"
    Get-Content $envFile
} else {
    Write-Host "✗ Archivo .env NO encontrado"
}

Write-Host ""
Write-Host "Iniciando Node.js..."
Write-Host "================================"

node .\src\server.js
