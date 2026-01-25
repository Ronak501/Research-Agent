#!/bin/bash

# Auto-update script for Docker containers
# Monitors file changes and rebuilds containers

echo "Starting auto-update watcher..."

# Function to rebuild and restart containers
rebuild_containers() {
    echo "Changes detected! Rebuilding containers..."
    
    # Stop containers
    docker-compose down
    
    # Rebuild and start
    docker-compose up --build -d
    
    echo "Containers rebuilt and restarted!"
}

# Function to rebuild specific service
rebuild_service() {
    local service=$1
    echo "Rebuilding $service..."
    
    docker-compose up --build -d $service
    
    echo "$service rebuilt!"
}

# Watch for changes in backend
watch_backend() {
    echo "Watching backend files..."
    while inotifywait -r -e modify,create,delete ./backend; do
        rebuild_service "backend"
        sleep 2
    done
}

# Watch for changes in frontend
watch_frontend() {
    echo "Watching frontend files..."
    while inotifywait -r -e modify,create,delete ./frontend --exclude 'node_modules|\.git'; do
        rebuild_service "frontend"
        sleep 2
    done
}

# Install inotify-tools if not present
if ! command -v inotifywait &> /dev/null; then
    echo "Installing inotify-tools..."
    sudo apt-get update && sudo apt-get install -y inotify-tools
fi

# Start watching in background
watch_backend &
watch_frontend &

# Keep script running
wait