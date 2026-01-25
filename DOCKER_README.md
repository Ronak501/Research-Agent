# Docker Setup for Research Chatbot

## Quick Start

1. **Build and run all services:**
   ```bash
   docker-compose up --build
   ```

2. **Run in background:**
   ```bash
   docker-compose up -d --build
   ```

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

4. **Stop and remove volumes:**
   ```bash
   docker-compose down -v
   ```

## Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **MongoDB**: localhost:27017

## Environment Variables

The setup uses the following default environment variables:
- Backend connects to MongoDB at `mongodb://mongodb:27017`
- Frontend connects to backend at `http://localhost:8000`
- CORS is configured for `http://localhost:3000`

## Development

For development with hot reload:
- Both frontend and backend are configured with volume mounts
- Changes to your code will automatically reload the services
- MongoDB data persists in a Docker volume

## Troubleshooting

- If ports are already in use, modify the port mappings in `docker-compose.yml`
- Check logs: `docker-compose logs [service-name]`
- Rebuild specific service: `docker-compose build [service-name]`