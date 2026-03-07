# FamilyTrack Deployment Configurations

## Railway.app Deployment

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### Step 2: Create Project
```bash
railway init
```

### Step 3: Add Services
1. PostgreSQL Database
   ```bash
   railway add postgresql
   ```

2. Redis (Optional)
   ```bash
   railway add redis
   ```

### Step 4: Set Environment Variables
```bash
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set NODE_ENV=production
railway variables set VITE_API_URL=https://your-app.railway.app
```

### Step 5: Deploy
```bash
railway up
```

### Railway Configuration (railway.json)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run render:start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## Render.com Deployment

### render.yaml
```yaml
services:
  # Backend API
  - type: web
    name: familytrack-api
    env: node
    region: oregon
    plan: starter
    buildCommand: npm install && npm run db:push
    startCommand: npm run api:start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: familytrack-db
          property: connectionString
      - key: REDIS_URL
        fromService:
          type: redis
          name: familytrack-redis
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: PORT
        value: 3000

  # Frontend (Static Site)
  - type: web
    name: familytrack-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
    envVars:
      - key: VITE_API_URL
        value: https://familytrack-api.onrender.com

databases:
  - name: familytrack-db
    databaseName: familytrack
    user: familytrack
    plan: starter

  - name: familytrack-redis
    plan: starter
```

---

## Docker Compose Production

### docker-compose.prod.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: familytrack-postgres
    environment:
      POSTGRES_DB: familytrack
      POSTGRES_USER: familytrack
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U familytrack"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: familytrack-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: familytrack-backend
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://familytrack:${POSTGRES_PASSWORD}@postgres:5432/familytrack
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.dev
      args:
        VITE_API_URL: http://localhost:3000
    container_name: familytrack-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: familytrack-nginx
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Dockerfile
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["npm", "run", "api:start:prod"]
```

---

## DigitalOcean App Platform

### Configuration
```yaml
name: familytrack
region: nyc

databases:
  - name: familytrack-db
    engine: PG
    version: "16"
    size: basic-xs
    num_nodes: 1

  - name: familytrack-redis
    engine: REDIS
    version: "7"

services:
  - name: api
    source:
      repo: https://github.com/yourusername/familytrack
      branch: main
    github:
      deploy_on_push: true
    build_command: npm install && npm run db:push
    run_command: npm run api:start
    environment_slug: node-js
    instance_size_slug: basic-xxs
    instance_count: 1
    http_port: 3000
    routes:
      - path: /api
    envs:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        scope: RUN_TIME
        value: ${familytrack-db.DATABASE_URL}
      - key: REDIS_URL
        scope: RUN_TIME
        value: ${familytrack-redis.REDIS_URL}
      - key: JWT_SECRET
        scope: RUN_TIME
        type: SECRET

  - name: web
    source:
      repo: https://github.com/yourusername/familytrack
      branch: main
    github:
      deploy_on_push: true
    build_command: npm install && npm run build
    environment_slug: node-js
    instance_size_slug: basic-xxs
    instance_count: 1
    static_sites:
      - name: frontend
        build_command: npm run build
        output_dir: /dist
    routes:
      - path: /
    envs:
      - key: VITE_API_URL
        value: https://familytrack-api.ondigitalocean.app
```

---

## Netlify Deployment (Frontend Only)

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
  VITE_API_URL = "https://your-backend-api.com"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## AWS Deployment (Advanced)

### Architecture
- **Frontend**: S3 + CloudFront
- **Backend**: ECS Fargate or EC2
- **Database**: RDS PostgreSQL
- **Cache**: ElastiCache Redis
- **File Storage**: S3

### Terraform Configuration (simplified)
```hcl
resource "aws_db_instance" "postgres" {
  identifier        = "familytrack-db"
  engine            = "postgres"
  engine_version    = "16"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  db_name           = "familytrack"
  username          = var.db_username
  password          = var.db_password
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id      = "familytrack-redis"
  engine          = "redis"
  node_type       = "cache.t3.micro"
  num_cache_nodes = 1
  engine_version  = "7.0"
}

resource "aws_ecs_service" "backend" {
  name            = "familytrack-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"
}
```

---

## Environment-Specific Configuration

### Development
```bash
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/familytrack
VITE_API_URL=http://localhost:3000
```

### Staging
```bash
NODE_ENV=staging
DATABASE_URL=postgresql://staging-db:5432/familytrack
VITE_API_URL=https://staging-api.familytrack.app
```

### Production
```bash
NODE_ENV=production
DATABASE_URL=postgresql://prod-db:5432/familytrack
VITE_API_URL=https://api.familytrack.app
```

---

## SSL/TLS Configuration

### Let's Encrypt with Certbot
```bash
# Install Certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d familytrack.app -d www.familytrack.app

# Auto-renewal
sudo certbot renew --dry-run
```

### Nginx SSL Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name familytrack.app www.familytrack.app;

    ssl_certificate /etc/letsencrypt/live/familytrack.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/familytrack.app/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Monitoring & Logging

### Recommended Tools
- **Application Monitoring**: Sentry, New Relic, Datadog
- **Logging**: Papertrail, Loggly, CloudWatch
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Performance**: Lighthouse CI, WebPageTest

### Health Check Endpoint
```typescript
// server/routes/health.ts
export async function healthCheck(request, reply) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: await checkDatabase(),
    redis: await checkRedis(),
  };

  return reply.code(200).send(health);
}
```

---

## Backup Strategy

### Database Backups
```bash
# Daily backup script
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Upload to S3
aws s3 cp backup-$(date +%Y%m%d).sql s3://familytrack-backups/
```

### Automated Backups (Railway/Render)
- Railway: Automatic daily backups
- Render: Automatic backups on paid plans
- DigitalOcean: Automatic daily backups

---

## Cost Estimates (Monthly)

| Platform | Hobby/Dev | Small (1K users) | Medium (10K users) |
|----------|-----------|------------------|--------------------|
| Railway | $5-10 | $20-40 | $100-200 |
| Render | Free-$7 | $25-50 | $150-300 |
| DigitalOcean | $12 | $50-100 | $200-400 |
| AWS | $20 | $100-200 | $500+ |
