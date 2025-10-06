# Friends Stream - Docker Deployment Guide

This guide explains how to deploy Friends Stream using Docker and docker-compose.

## 🐳 Quick Start with Docker

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+

### Run with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 📦 What's Included

### Services

1. **Backend** (`Dockerfile.backend`)
   - Express.js + Socket.IO server
   - SQLite database with persistent volume
   - Port: 3001
   - Health checks enabled

2. **Frontend** (`Dockerfile.frontend`)
   - Vite React app (production build)
   - Nginx web server
   - Proxies API and WebSocket requests to backend
   - Port: 3000 (mapped from internal port 80)

### Volumes

- `backend-data`: Persistent storage for SQLite database at `/app/data/videos.db`

### Networks

- `friends-stream-network`: Bridge network for inter-container communication

## 🚀 Deployment to Coolify

### Step 1: Push Code to GitHub

The Docker files are already in your repository. Just push:

```bash
git push origin main
```

### Step 2: Configure Coolify

1. **Create New Resource** → **Docker Compose**
2. **Connect Repository**: `Ntrakiyski/friends-stream-z1dz`
3. **Branch**: `main`
4. **Docker Compose File**: `docker-compose.yml` (auto-detected)

### Step 3: Environment Variables (Optional)

Set these in Coolify if needed:

```bash
# Backend
PORT=3001
CORS_ORIGIN=http://your-domain.com
DATABASE_PATH=/app/data/videos.db
NODE_ENV=production

# Frontend (build-time)
VITE_API_URL=http://your-domain.com
VITE_SOCKET_URL=http://your-domain.com
```

### Step 4: Deploy

Click **Deploy** in Coolify. It will:
1. Clone your repository
2. Build both Docker images
3. Start containers with docker-compose
4. Set up networking and volumes

### Step 5: Configure Domain

In Coolify, add your domain:
- Point to the **frontend** service (port 3000)
- Nginx will proxy API/Socket.IO to backend automatically

## 🔧 Configuration

### Custom Ports

Edit `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "YOUR_PORT:3001"  # Change YOUR_PORT
  
  frontend:
    ports:
      - "YOUR_PORT:80"    # Change YOUR_PORT
```

### Custom CORS

Set environment variable in Coolify or `.env`:

```bash
CORS_ORIGIN=https://your-domain.com
```

### Database Persistence

The SQLite database is stored in a Docker volume:
- **Volume name**: `backend-data`
- **Container path**: `/app/data/videos.db`

To backup:
```bash
docker-compose exec backend cp /app/data/videos.db /app/data/backup.db
docker cp friends-stream-backend:/app/data/backup.db ./backup.db
```

## 🐛 Troubleshooting

### Check Container Status

```bash
docker-compose ps
```

### View Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### Access Container Shell

```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh
```

### Health Checks

Both services have health checks:

```bash
# Check health status
docker inspect friends-stream-backend | grep -A 10 Health
docker inspect friends-stream-frontend | grep -A 10 Health
```

### Common Issues

**1. Backend can't start**
```bash
# Check if database directory exists
docker-compose exec backend ls -la /app/data

# Check permissions
docker-compose exec backend touch /app/data/test.txt
```

**2. Frontend can't connect to backend**
```bash
# Check network connectivity
docker-compose exec frontend wget http://backend:3001/api/videos

# Check nginx config
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf
```

**3. Port already in use**
```bash
# Change ports in docker-compose.yml
# OR stop conflicting services
lsof -i :3000
lsof -i :3001
```

## 🏗️ Building Images Separately

### Build Backend

```bash
docker build -f Dockerfile.backend -t friends-stream-backend .
docker run -p 3001:3001 -v $(pwd)/data:/app/data friends-stream-backend
```

### Build Frontend

```bash
docker build -f Dockerfile.frontend -t friends-stream-frontend .
docker run -p 3000:80 friends-stream-frontend
```

## 📊 Resource Usage

Typical resource consumption:
- **Backend**: ~50-100 MB RAM, 0.1-0.5% CPU (idle)
- **Frontend**: ~10-20 MB RAM, 0.1% CPU (nginx)
- **Total**: ~100-150 MB RAM

During active streaming:
- **Backend**: ~150-300 MB RAM, 5-15% CPU
- **Frontend**: Similar (depends on users)

## 🔐 Security Notes

- Change default ports in production
- Use HTTPS/TLS (let Coolify handle this)
- Set proper CORS origins
- Consider adding authentication
- Regularly backup database volume

## 📝 Development with Docker

For development with hot-reload:

```bash
# Use docker-compose.dev.yml (if you create one)
docker-compose -f docker-compose.dev.yml up
```

Or just use local development:
```bash
npm run dev
```

---

**Docker deployment ready! 🚀**

For Coolify deployment, just push to GitHub and point Coolify to your repository.
