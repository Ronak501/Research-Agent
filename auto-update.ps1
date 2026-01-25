# PowerShell Auto-Update Script for Docker Containers
# Monitors file changes and rebuilds containers on Windows

Write-Host "Starting Docker auto-update watcher..." -ForegroundColor Green

# Function to rebuild containers
function Rebuild-Containers {
    Write-Host "Changes detected! Rebuilding containers..." -ForegroundColor Yellow
    
    # Stop containers
    docker-compose down
    
    # Rebuild and start
    docker-compose up --build -d
    
    Write-Host "Containers rebuilt and restarted!" -ForegroundColor Green
}

# Function to rebuild specific service
function Rebuild-Service {
    param($ServiceName)
    Write-Host "Rebuilding $ServiceName..." -ForegroundColor Yellow
    
    docker-compose up --build -d $ServiceName
    
    Write-Host "$ServiceName rebuilt!" -ForegroundColor Green
}

# Create file system watcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = Get-Location
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Define what to watch for
$watcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite -bor [System.IO.NotifyFilters]::FileName

# Backend file watcher
$backendAction = {
    $path = $Event.SourceEventArgs.FullPath
    if ($path -like "*\backend\*" -and $path -notlike "*\__pycache__\*") {
        Write-Host "Backend file changed: $path" -ForegroundColor Cyan
        Start-Sleep -Seconds 1
        Rebuild-Service "backend"
    }
}

# Frontend file watcher
$frontendAction = {
    $path = $Event.SourceEventArgs.FullPath
    if ($path -like "*\frontend\*" -and $path -notlike "*\node_modules\*") {
        Write-Host "Frontend file changed: $path" -ForegroundColor Cyan
        Start-Sleep -Seconds 1
        Rebuild-Service "frontend"
    }
}

# Register event handlers
Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action $backendAction
Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action $frontendAction

Write-Host "File watcher started. Press Ctrl+C to stop." -ForegroundColor Green

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    $watcher.Dispose()
    Write-Host "File watcher stopped." -ForegroundColor Red
}