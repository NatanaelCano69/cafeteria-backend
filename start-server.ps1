Set-Location C:\Users\leo08\repos\cafeteria-backend
Write-Host "Starting backend server..."
Write-Host "Node version:"
node --version
Write-Host ""
Write-Host "Starting server on port 3001..."
& node .\src\server.js
